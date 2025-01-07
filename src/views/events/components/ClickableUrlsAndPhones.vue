<template>
  <div v-sanitize="htmlizedText"></div>
</template>

<script>
import flowRight from "lodash-es/flowRight";

const handleMicrosoftTeamsLink = (text) =>
  text.replace(
    /(?!href=['"])https:\/\/teams\.microsoft\.com\/l\/meetup-join([^\s\n]+)/gi,
    (url) => `<a target="_blank" href="${url}">Join Microsoft Teams Meeting</a>`
  );
const handleMicrosoftTeamsLocalDialIns = (text) =>
  text.replace(
    /(?!href=['"])https:\/\/dialin\.teams\.microsoft\.com\/([^\s\n]+)/gi,
    (url) => `<a target="_blank" href="${url}">Local Dial-in Numbers</a>`
  );
const handleAllOtherLinks = (text) =>
  text.replace(
    /(?!href=['"])([^"']|^)(https?:\/\/([0-9a-zA-Z\-_]+\.)+[0-9a-zA-Z\-_]+[^?\s\n]+)(\?[^\s\n]+)?/gi,
    (url) => `<a target="_blank" href="${url}">${url}</a>`
  );
const makePhoneLinks = (text) =>
  text.replace(/\+([0-9\s-()]+)/gi, (url) => `<a target="_blank" href="tel:${url}">${url}</a>`);

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    htmlizedText() {
      return flowRight(
        makePhoneLinks,
        handleAllOtherLinks,
        handleMicrosoftTeamsLocalDialIns,
        handleMicrosoftTeamsLink
      )(this.text);
    },
  },
};
</script>
