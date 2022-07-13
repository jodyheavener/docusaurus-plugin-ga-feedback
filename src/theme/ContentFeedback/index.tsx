import React, { useMemo, useState } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import noop from "@docusaurus/Noop";
import { PLUGIN_ID } from "../../shared";
import styles from "./index.module.css";

enum EventType {
  Rating = "content_rating",
  Response = "content_response",
}

const createEventDispatcher =
  (script: PluginOptions["script"]) => (type: EventType, value: string) => {
    switch (script) {
      case "gtag":
        window.gtag("event", type, {
          event_category: "Content Feedback",
          event_label: value,
        });
        break;
      case "analytics":
        window.ga("send", {
          hitType: "event",
          eventAction: type,
          eventCategory: "Content Feedback",
          eventLabel: value,
        });
        break;
      default:
        throw new Error("Unknown GA script type");
    }
  };

const ContentFeedback = () => {
  const { script, enabled } = usePluginData(PLUGIN_ID) as PluginConfig;
  const [rated, setRated] = useState<boolean>(false);
  const [responded, setResponded] = useState<boolean>(false);
  const responseRef = React.useRef<HTMLTextAreaElement>(null);
  const dispatchEvent = useMemo(
    () => (enabled ? createEventDispatcher(script) : noop),
    [script]
  );

  if (!rated) {
    return (
      <div>
        <p className={styles.label}>Was this page helpful?</p>
        <div>
          <button
            onClick={() => {
              dispatchEvent(EventType.Rating, "1");
              setRated(true);
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              dispatchEvent(EventType.Rating, "0");
              setRated(true);
            }}
          >
            No
          </button>
        </div>
      </div>
    );
  }

  if (!responded) {
    return (
      <div>
        <p className={styles.label}>Anything to add?</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            dispatchEvent(EventType.Response, responseRef.current!.value);
            setResponded(true);
          }}
        >
          <textarea ref={responseRef}></textarea>
          <button>Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <p>Thank you for your feedback!</p>
    </div>
  );
};

export default ContentFeedback;
