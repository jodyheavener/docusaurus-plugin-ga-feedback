import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";
import { PLUGIN_ID } from "./shared";

const pluginGaFeedback = (
  _: LoadContext,
  { script = "gtag" }: PluginOptions
): Plugin<null> => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: PLUGIN_ID,

    contentLoaded({ actions }) {
      actions.setGlobalData({ script, enabled: isProd });
    },

    getThemePath() {
      return "../dist/theme";
    },
  };
};

export default pluginGaFeedback;

const pluginOptionsSchema = Joi.object<PluginOptions>({
  script: Joi.string().valid("gtag", "analytics").optional(),
});

export const validateOptions = ({
  validate,
  options,
}: OptionValidationContext<
  Partial<PluginOptions>,
  PluginOptions
>): PluginOptions => {
  return validate(pluginOptionsSchema, options);
};
