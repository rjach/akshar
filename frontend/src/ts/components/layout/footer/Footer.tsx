import { For, JSXElement } from "solid-js";

import { BRAND } from "../../../constants/brand";
import { SEO_GUIDES } from "../../../constants/seo-guides";
import { getIsScreenshotting } from "../../../states/core";
import { showModal } from "../../../states/modals";
import { isFocusMode } from "../../../states/test";
import { cn } from "../../../utils/cn";
import { Button } from "../../common/Button";
import { isLoadingShown } from "../../core/PageSwitcher";
import { Keytips } from "./Keytips";
import { ThemeIndicator } from "./ThemeIndicator";

export function Footer(): JSXElement {
  return (
    <footer
      class={cn("relative text-xs text-sub", {
        "opacity-0": getIsScreenshotting(),
      })}
      data-focused={isFocusMode() ? "" : undefined}
      inert={isLoadingShown()}
    >
      <Keytips />

      {/* plain links: the guides are static pages, not app routes */}
      <nav
        aria-label="Nepali typing guides"
        class={cn(
          "mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1 transition-opacity",
          { "opacity-0": isFocusMode() },
        )}
      >
        <For each={SEO_GUIDES}>
          {(guide) => (
            <a
              href={`/${guide.slug}`}
              lang={guide.lang}
              class="text-sub hover:text-text"
            >
              {guide.label}
            </a>
          )}
        </For>
      </nav>

      <div
        class={cn("-m-2 flex justify-between gap-8 transition-opacity", {
          "opacity-0": isFocusMode(),
        })}
      >
        <div class="grid grid-cols-1 justify-items-start xs:grid-cols-2 sm:grid-cols-4 lg:flex">
          <Button
            variant="text"
            text="contact"
            fa={{
              icon: "fa-envelope",
              fixedWidth: true,
            }}
            onClick={() => showModal("Contact")}
          />
          <Button
            variant="text"
            text="based on monkeytype"
            fa={{
              icon: "fa-code",
              fixedWidth: true,
            }}
            href={BRAND.upstreamUrl}
          />
          <Button
            variant="text"
            text="terms"
            fa={{
              icon: "fa-file-contract",
              fixedWidth: true,
            }}
            href="/terms-of-service.html"
          />
          <Button
            href="/security-policy.html"
            variant="text"
            text="security"
            fa={{
              icon: "fa-shield-alt",
              fixedWidth: true,
            }}
          />
          <Button
            href="/privacy-policy.html"
            variant="text"
            text="privacy"
            fa={{
              icon: "fa-lock",
              fixedWidth: true,
            }}
          />
        </div>
        <div class="flex flex-col items-end text-right lg:flex-row">
          <ThemeIndicator />
        </div>
      </div>
    </footer>
  );
}
