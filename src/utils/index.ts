import { v4 as uuidv4 } from 'uuid';
import { debugLogger } from './debugLogger';

export const isNotDefined = <T>(value: T | undefined | null): value is undefined | null => value === undefined || value === null;

export const isDefined = <T>(value: T | undefined | null): value is NonNullable<T> => value !== undefined && value !== null;

export const isEmpty = (value: string | undefined | null): value is undefined => value === undefined || value === null || value === '';

export const isNotEmpty = (value: string | undefined | null): value is string => value !== undefined && value !== null && value !== '';

export const sendRequest = async <ResponseData>(
  params:
    | {
        url: string;
        method: string;
        body?: Record<string, unknown> | FormData;
        type?: string;
        headers?: Record<string, any>;
        formData?: FormData;
        onRequest?: (request: RequestInit) => Promise<void>;
        authService?: any; // Add authService parameter
      }
    | string,
): Promise<{ data?: ResponseData; error?: Error }> => {
  try {
    const url = typeof params === 'string' ? params : params.url;
    
    // Build base headers
    let headers: Record<string, any> = {};
    if (typeof params !== 'string' && isDefined(params.body)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Add OAuth access token if authService is provided and user is authenticated
    if (typeof params !== 'string' && params.authService) {
      const accessToken = params.authService.getAccessToken();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        debugLogger.log('🔐 Including OAuth access token in request headers');
      }
    }
    
    // Merge with any additional headers
    if (typeof params !== 'string' && params.headers) {
      headers = { ...headers, ...params.headers };
    }
    
    // Set to undefined if no headers
    const finalHeaders = Object.keys(headers).length > 0 ? headers : undefined;
    let body: string | FormData | undefined = typeof params !== 'string' && isDefined(params.body) ? JSON.stringify(params.body) : undefined;
    if (typeof params !== 'string' && params.formData) body = params.formData;

    const requestInfo: RequestInit = {
      method: typeof params === 'string' ? 'GET' : params.method,
      mode: 'cors',
      headers: finalHeaders,
      body,
    };

    if (typeof params !== 'string' && params.onRequest) {
      await params.onRequest(requestInfo);
    }

    debugLogger.log('Making request to:', url);
    debugLogger.log('Request options:', {
      method: requestInfo.method,
      headers: requestInfo.headers,
      hasBody: !!requestInfo.body,
      bodyType: typeof requestInfo.body
    });

    const response = await fetch(url, requestInfo);

    debugLogger.log('Response status:', response.status);
    debugLogger.log('Response headers:', Object.fromEntries(response.headers.entries()));

    let data: any;
    const contentType = response.headers.get('Content-Type');
    debugLogger.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      debugLogger.log('Parsed JSON data:', data);
    } else if (typeof params !== 'string' && params.type === 'blob') {
      data = await response.blob();
      debugLogger.log('Parsed blob data size:', data.size);
    } else {
      data = await response.text();
      debugLogger.log('Parsed text data:', data);
    }
    if (!response.ok) {
      let errorMessage;

      if (typeof data === 'object' && 'error' in data) {
        errorMessage = data.error;
      } else {
        errorMessage = data || response.statusText;
      }

      throw errorMessage;
    }

    return { data };
  } catch (e) {
    console.error(e);
    return { error: e as Error };
  }
};

export const setLocalStorageChatflow = (chatflowid: string, chatId: string, saveObj: Record<string, any> = {}) => {
  const chatDetails = localStorage.getItem(`${chatflowid}_EXTERNAL`);
  const obj = { ...saveObj };
  if (chatId) obj.chatId = chatId;

  if (!chatDetails) {
    localStorage.setItem(`${chatflowid}_EXTERNAL`, JSON.stringify(obj));
  } else {
    try {
      const parsedChatDetails = JSON.parse(chatDetails);
      localStorage.setItem(`${chatflowid}_EXTERNAL`, JSON.stringify({ ...parsedChatDetails, ...obj }));
    } catch (e) {
      const chatId = chatDetails;
      obj.chatId = chatId;
      localStorage.setItem(`${chatflowid}_EXTERNAL`, JSON.stringify(obj));
    }
  }
};

export const getLocalStorageChatflow = (chatflowid: string) => {
  const chatDetails = localStorage.getItem(`${chatflowid}_EXTERNAL`);
  if (!chatDetails) return {};
  try {
    return JSON.parse(chatDetails);
  } catch (e) {
    return {};
  }
};

export const removeLocalStorageChatHistory = (chatflowid: string) => {
  const chatDetails = localStorage.getItem(`${chatflowid}_EXTERNAL`);
  if (!chatDetails) return;
  try {
    const parsedChatDetails = JSON.parse(chatDetails);
    if (parsedChatDetails.lead) {
      // Dont remove lead when chat is cleared
      const obj = { lead: parsedChatDetails.lead };
      localStorage.removeItem(`${chatflowid}_EXTERNAL`);
      localStorage.setItem(`${chatflowid}_EXTERNAL`, JSON.stringify(obj));
    } else {
      localStorage.removeItem(`${chatflowid}_EXTERNAL`);
    }
  } catch (e) {
    return;
  }
};

export const getBubbleButtonSize = (size: 'small' | 'medium' | 'large' | number | undefined) => {
  if (!size) return 48;
  if (typeof size === 'number') return size;
  if (size === 'small') return 32;
  if (size === 'medium') return 48;
  if (size === 'large') return 64;
  return 48;
};

export const setCookie = (cname: string, cvalue: string, exdays: number) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

export const getCookie = (cname: string): string => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};
