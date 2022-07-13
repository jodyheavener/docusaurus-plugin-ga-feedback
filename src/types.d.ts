/// <reference types="@docusaurus/module-type-aliases" />

type PluginOptions = { script: "gtag" | "analytics" };
type PluginConfig = PluginOptions & { enabled: boolean };

interface Window {
  ga: (
    command: "send",
    params: {
      hitType: "event";
      eventAction: string;
      eventCategory: string;
      eventLabel: string;
      eventValue?: number;
    }
  ) => void;

  gtag: (
    command: "event",
    action: string,
    params: {
      event_category: string;
      event_label: string;
      value?: number;
    }
  ) => void;
}
