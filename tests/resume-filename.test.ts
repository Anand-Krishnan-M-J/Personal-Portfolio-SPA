import assert from "node:assert/strict";
import test from "node:test";

import {
  getResumeFileName,
  resumeTemplates,
} from "../components/resumeBuilder/templates/catalog";

test("resume filenames follow the edited name and selected template", () => {
  assert.equal(
    getResumeFileName(resumeTemplates[0], "Avery Stone"),
    "Avery_Stone_Resume.pdf",
  );
  assert.equal(
    getResumeFileName(resumeTemplates[1], "Avery Stone"),
    "Avery_Stone_Resume_Classic_Airy.pdf",
  );
});

test("resume filenames are portable and have a generic empty-name fallback", () => {
  assert.equal(getResumeFileName(resumeTemplates[0], ""), "Resume.pdf");
  assert.equal(
    getResumeFileName(resumeTemplates[1], "José / 🧪"),
    "Jose_🧪_Resume_Classic_Airy.pdf",
  );
  assert.equal(
    getResumeFileName(resumeTemplates[0], "李 小龙"),
    "李_小龙_Resume.pdf",
  );

  const hostileName = '../<script>:"candidate"?*|\\';
  const fileName = getResumeFileName(resumeTemplates[1], hostileName);
  assert.doesNotMatch(fileName, /[\\/:*?"<>|]/);
  assert.match(fileName, /_Resume_Classic_Airy\.pdf$/);
});
