import { FeedbackRatingType } from '@/queries/sendMessageQuery';
import { BotMessageTheme, FooterTheme, TextInputTheme, UserMessageTheme, FeedbackTheme, DisclaimerPopUpTheme, DateTimeToggleTheme } from '@/features/bubble/types';
import { FilePreview } from '@/components/inputs/textInput/components/FilePreview';
import { AuthenticationConfig } from '@/types/auth';
export type FileEvent<T = EventTarget> = {
    target: T;
};
export type FormEvent<T = EventTarget> = {
    preventDefault: () => void;
    currentTarget: T;
};
type IUploadConstraits = {
    fileTypes: string[];
    maxUploadSize: number;
};
export type UploadsConfig = {
    imgUploadSizeAndTypes: IUploadConstraits[];
    fileUploadSizeAndTypes: IUploadConstraits[];
    isImageUploadAllowed: boolean;
    isSpeechToTextEnabled: boolean;
    isRAGFileUploadAllowed: boolean;
};
type FilePreviewData = string | ArrayBuffer;
type FilePreview = {
    data: FilePreviewData;
    mime: string;
    name: string;
    preview: string;
    type: string;
};
type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting' | 'leadCaptureMessage';
type ExecutionState = 'INPROGRESS' | 'FINISHED' | 'ERROR' | 'TERMINATED' | 'TIMEOUT' | 'STOPPED';
export type IAgentReasoning = {
    agentName?: string;
    messages?: string[];
    usedTools?: any[];
    artifacts?: FileUpload[];
    sourceDocuments?: any[];
    instructions?: string;
    nextAgent?: string;
};
export type IAction = {
    id?: string;
    data?: any;
    elements?: Array<{
        type: string;
        label: string;
    }>;
    mapping?: {
        approve: string;
        reject: string;
        toolCalls: any[];
    };
};
export type FileUpload = Omit<FilePreview, 'preview'>;
export type AgentFlowExecutedData = {
    nodeLabel: string;
    nodeId: string;
    data: any;
    previousNodeIds: string[];
    status?: ExecutionState;
};
export type MessageType = {
    messageId?: string;
    message: string;
    type: messageType;
    sourceDocuments?: any;
    fileAnnotations?: any;
    fileUploads?: Partial<FileUpload>[];
    artifacts?: Partial<FileUpload>[];
    agentReasoning?: IAgentReasoning[];
    execution?: any;
    agentFlowEventStatus?: string;
    agentFlowExecutedData?: any;
    usedTools?: any[];
    action?: IAction | null;
    rating?: FeedbackRatingType;
    id?: string;
    followUpPrompts?: string;
    dateTime?: string;
};
type observerConfigType = (accessor: string | boolean | object | MessageType[]) => void;
export type observersConfigType = Record<'observeUserInput' | 'observeLoading' | 'observeMessages', observerConfigType>;
export type BotProps = {
    chatflowid: string;
    apiHost?: string;
    onRequest?: (request: RequestInit) => Promise<void>;
    chatflowConfig?: Record<string, unknown>;
    backgroundColor?: string;
    welcomeMessage?: string;
    errorMessage?: string;
    botMessage?: BotMessageTheme;
    userMessage?: UserMessageTheme;
    textInput?: TextInputTheme;
    feedback?: FeedbackTheme;
    poweredByTextColor?: string;
    badgeBackgroundColor?: string;
    bubbleBackgroundColor?: string;
    bubbleTextColor?: string;
    showTitle?: boolean;
    showAgentMessages?: boolean;
    title?: string;
    titleAvatarSrc?: string;
    titleTextColor?: string;
    titleBackgroundColor?: string;
    formBackgroundColor?: string;
    formTextColor?: string;
    fontSize?: number;
    isFullPage?: boolean;
    footer?: FooterTheme;
    sourceDocsTitle?: string;
    observersConfig?: observersConfigType;
    starterPrompts?: string[] | Record<string, {
        prompt: string;
    }>;
    starterPromptFontSize?: number;
    clearChatOnReload?: boolean;
    disclaimer?: DisclaimerPopUpTheme;
    dateTimeToggle?: DateTimeToggleTheme;
    renderHTML?: boolean;
    closeBot?: () => void;
    authentication?: AuthenticationConfig;
};
export type LeadsConfig = {
    status: boolean;
    title?: string;
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    successMessage?: string;
};
export declare const Bot: (botProps: BotProps & {
    class?: string;
}) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=Bot.d.ts.map