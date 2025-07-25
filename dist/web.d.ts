declare global {
    interface Window {
        FlowiseDebug: {
            enable: () => void;
            disable: () => void;
            isEnabled: () => boolean;
        };
    }
}
declare const chatbot: {
    initFull: (props: {
        chatflowid: string;
        apiHost?: string | undefined;
        onRequest?: ((request: RequestInit) => Promise<void>) | undefined;
        chatflowConfig?: Record<string, unknown> | undefined;
        observersConfig?: import("./components/Bot").observersConfigType | undefined;
        theme?: import("./features/bubble/types").BubbleTheme | undefined;
        authentication?: import("./types/auth").AuthenticationConfig | undefined;
    } & {
        id?: string | undefined;
    }) => void;
    init: (props: {
        chatflowid: string;
        apiHost?: string | undefined;
        onRequest?: ((request: RequestInit) => Promise<void>) | undefined;
        chatflowConfig?: Record<string, unknown> | undefined;
        observersConfig?: import("./components/Bot").observersConfigType | undefined;
        theme?: import("./features/bubble/types").BubbleTheme | undefined;
        authentication?: import("./types/auth").AuthenticationConfig | undefined;
    }) => void;
    destroy: () => void;
};
export default chatbot;
//# sourceMappingURL=web.d.ts.map