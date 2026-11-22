import { Link } from "@tanstack/solid-router";
import { JSXElement } from "solid-js";

import { BRAND } from "../../constants/brand";
import { hideModal } from "../../states/modals";
import { AnimatedModal } from "../common/AnimatedModal";
import { Button } from "../common/Button";

export function ContactModal(): JSXElement {
  const buttonClass = " gap-4 text-md p-4 text-lg justify-start";

  return (
    <AnimatedModal id="Contact" modalClass="max-w-4xl" title="Contact">
      <div>
        Feel free to send an email to {BRAND.contactEmail} (the buttons below
        will open the default mail client).
        <br />
        <br />
        Akshar has no accounts: your results and settings stay in this browser.
        You can clear your history on the{" "}
        <Link
          to="/stats"
          onClick={() => {
            hideModal("Contact");
          }}
        >
          stats
        </Link>{" "}
        page.
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <Button
          variant="button"
          href={`mailto:${BRAND.contactEmail}?subject=[Question] `}
          text="Question"
          class={buttonClass}
          fa={{
            icon: "fa-question-circle",
            fixedWidth: true,
          }}
        />
        <Button
          variant="button"
          href={`mailto:${BRAND.contactEmail}?subject=[Feedback] `}
          fa={{
            icon: "fa-comment-dots",
            fixedWidth: true,
          }}
          text="Feedback"
          class={buttonClass}
        />
        <Button
          variant="button"
          href={`mailto:${BRAND.contactEmail}?subject=[Bug] `}
          fa={{
            icon: "fa-bug",
            fixedWidth: true,
          }}
          text="Bug Report"
          class={buttonClass}
        />
        <Button
          variant="button"
          href={`mailto:${BRAND.contactEmail}?subject=[Business] `}
          fa={{
            icon: "fa-briefcase",
            fixedWidth: true,
          }}
          text="Business Inquiry"
          class={buttonClass}
        />
        <Button
          variant="button"
          href={`mailto:${BRAND.contactEmail}?subject=[Other] `}
          fa={{
            icon: "fa-ellipsis-h",
            fixedWidth: true,
          }}
          text="Other"
          class={buttonClass}
        />
      </div>
    </AnimatedModal>
  );
}
