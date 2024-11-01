import messages from "@/messages/en.json";

type Namespace = keyof typeof messages;

/**
 * @param "ns" Namespace of the messages
 * @returns function that accepts a "key" and returns the corresponding message.
 * 			Also accepts a set of values to be replaced in the message.
 * 			The accepted object: { "replacement": "value" }
 * 			The string that will be replaced: { replacement } | {replacement}
 * @limitations The messages JSON must be two levels deep!
 *
 * @see https://stackoverflow.com/a/51851844/6543935
 * 			const t = msgs("Navigation");
 *			type tType = Parameters<typeof t>[0];
 */
function msgs<T extends Namespace>(ns: T) {
  const msg = messages[ns];

  type Messages = keyof typeof msg;

  return function <T extends Messages>(key: T, replace?: Record<string, string | number>) {
    let keyAsString = msg[key] as string;

    if (replace) {
      Object.keys(replace).forEach((k) => {
        const regex = new RegExp(`{\\s*${k}\\s*}`, "g");

        keyAsString = keyAsString.replace(regex, String(replace[k]));
      });

      return keyAsString;
    }

    return keyAsString;
  };
}

export { messages, msgs };
