// Analytics and UTM attribution engine for PrepVisor Marketing Website

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  ref?: string;
  landing_page?: string;
  referrer?: string;
  captured_at?: string;
}

const STORAGE_KEY = 'prepvisor_utm_attribution';
const COOKIE_NAME = 'pv_utm';

function setCrossDomainCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const hostname = typeof window !== 'undefined' ? window.location?.hostname || '' : '';
  let domainPart = '';
  if (hostname.endsWith('prepvisor.in')) {
    domainPart = '; domain=.prepvisor.in';
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainPart}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function parseReferrer(referrer: string): { source: string; medium: string } | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes('prepvisor.in') || host.includes('localhost') || host.includes('127.0.0.1')) {
      return null;
    }
    if (host.includes('google.')) return { source: 'google', medium: 'organic' };
    if (host.includes('bing.')) return { source: 'bing', medium: 'organic' };
    if (host.includes('duckduckgo.')) return { source: 'duckduckgo', medium: 'organic' };
    if (host.includes('linkedin.')) return { source: 'linkedin', medium: 'referral' };
    if (host.includes('github.')) return { source: 'github', medium: 'referral' };
    if (host.includes('twitter.') || host.includes('t.co') || host.includes('x.com')) return { source: 'twitter', medium: 'referral' };
    if (host.includes('youtube.')) return { source: 'youtube', medium: 'referral' };
    if (host.includes('reddit.')) return { source: 'reddit', medium: 'referral' };
    return { source: host.replace(/^www\./, ''), medium: 'referral' };
  } catch (_) {
    return null;
  }
}

/**
 * Extracts and stores UTM and referrer attribution from the URL query string.
 * Automatically infers organic search/referral or direct traffic when no UTMs are present.
 */
export function captureUtmParams(customSearch?: string, customReferrer?: string): UtmParams {
  const params: UtmParams = {};

  if (typeof window === 'undefined' && customSearch === undefined) {
    return params;
  }

  const search = customSearch !== undefined ? customSearch : (typeof window !== 'undefined' ? window.location.search : '');
  const referrer = customReferrer !== undefined ? customReferrer : (typeof document !== 'undefined' ? document.referrer : '');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  const query = new URLSearchParams(search);
  const utmSource = query.get('utm_source');
  const utmMedium = query.get('utm_medium');
  const utmCampaign = query.get('utm_campaign');
  const utmContent = query.get('utm_content');
  const utmTerm = query.get('utm_term');
  const ref = query.get('ref');

  const hasNewUtms = Boolean(utmSource || utmCampaign || utmMedium || ref);

  if (hasNewUtms) {
    if (utmSource) params.utm_source = utmSource;
    if (utmMedium) params.utm_medium = utmMedium;
    if (utmCampaign) params.utm_campaign = utmCampaign;
    if (utmContent) params.utm_content = utmContent;
    if (utmTerm) params.utm_term = utmTerm;
    if (ref) params.ref = ref;
    params.landing_page = pathname;
    if (referrer) params.referrer = referrer;
    params.captured_at = new Date().toISOString();

    const serialized = JSON.stringify(params);
    setCrossDomainCookie(COOKIE_NAME, serialized);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch (_) {}

    return params;
  }

  // Check if we already have stored attribution
  const existing = getUtmParams();
  if (existing && (existing.utm_source || existing.ref)) {
    return existing;
  }

  // Infer organic or direct traffic for first-time visitors without UTM tags
  const inferred = parseReferrer(referrer);
  if (inferred) {
    params.utm_source = inferred.source;
    params.utm_medium = inferred.medium;
    params.utm_campaign = 'organic';
  } else {
    params.utm_source = 'direct';
    params.utm_medium = 'direct';
    params.utm_campaign = 'direct';
  }
  params.landing_page = pathname;
  if (referrer) params.referrer = referrer;
  params.captured_at = new Date().toISOString();

  const serialized = JSON.stringify(params);
  setCrossDomainCookie(COOKIE_NAME, serialized);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch (_) {}

  return params;
}

/**
 * Retrieves the currently active UTM attribution parameters.
 */
export function getUtmParams(): UtmParams {
  try {
    const cookieVal = getCookie(COOKIE_NAME);
    if (cookieVal) {
      return JSON.parse(cookieVal) as UtmParams;
    }
    if (typeof localStorage !== 'undefined') {
      const localVal = localStorage.getItem(STORAGE_KEY);
      if (localVal) {
        return JSON.parse(localVal) as UtmParams;
      }
    }
  } catch (_) {}
  return {};
}

/**
 * Appends active UTM attribution to an outbound URL (e.g. to app.prepvisor.in).
 */
export function decorateUrlWithUtms(targetUrl: string): string {
  try {
    const utms = getUtmParams();
    const hasUtms = Boolean(utms.utm_source || utms.utm_campaign || utms.utm_medium || utms.ref);
    if (!hasUtms) return targetUrl;

    const isRelative = !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://');
    const dummyBase = 'https://dummy.prepvisor.local';
    const parsed = new URL(targetUrl, dummyBase);

    if (utms.utm_source && !parsed.searchParams.has('utm_source')) {
      parsed.searchParams.set('utm_source', utms.utm_source);
    }
    if (utms.utm_medium && !parsed.searchParams.has('utm_medium')) {
      parsed.searchParams.set('utm_medium', utms.utm_medium);
    }
    if (utms.utm_campaign && !parsed.searchParams.has('utm_campaign')) {
      parsed.searchParams.set('utm_campaign', utms.utm_campaign);
    }
    if (utms.utm_content && !parsed.searchParams.has('utm_content')) {
      parsed.searchParams.set('utm_content', utms.utm_content);
    }
    if (utms.utm_term && !parsed.searchParams.has('utm_term')) {
      parsed.searchParams.set('utm_term', utms.utm_term);
    }
    if (utms.ref && !parsed.searchParams.has('ref')) {
      parsed.searchParams.set('ref', utms.ref);
    }

    if (isRelative) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
    return parsed.toString();
  } catch (_) {
    return targetUrl;
  }
}

/**
 * Initializes Google Analytics 4 tag and extracts initial UTM parameters.
 */
export function initAnalytics(overrideId?: string): void {
  const measurementId =
    overrideId ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID);

  captureUtmParams();

  if (typeof window === 'undefined' || !measurementId) {
    return;
  }

  try {
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: true,
      });
    }
  } catch (err) {
    // Fail silently so ad-blockers never disrupt app execution
    console.warn('[PrepVisor Analytics] GA4 init skipped or blocked:', err);
  }
}

/**
 * Safely dispatches a custom business event with merged UTM parameters.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  const utms = getUtmParams();
  const payload = {
    ...params,
    utm_source: utms.utm_source || 'direct',
    utm_campaign: utms.utm_campaign,
    utm_medium: utms.utm_medium,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, payload);
    } catch (_) {}
  } else if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.debug(`[PrepVisor Event] ${eventName}:`, payload);
  }
}
