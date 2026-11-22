import { Link } from "@tanstack/solid-router";
import { JSXElement } from "solid-js";

import { BRAND } from "../../../constants/brand";
import { getRoutePage } from "../../../states/router";
import { isFocusMode } from "../../../states/test";
import { restartTest } from "../../../test/test-logic";
import { cn } from "../../../utils/cn";

export function Logo(): JSXElement {
  return (
    <Link
      to="/"
      class="group/logo -m-2 mr-2 flex h-6 w-max items-center rounded-[0.8rem] p-2"
      aria-label={`${BRAND.name} Home`}
      style={{
        "box-sizing": "content-box",
      }}
      data-ui-element="logo"
      onClick={() => {
        if (getRoutePage() === "test") void restartTest();
      }}
    >
      <h1
        class={cn(
          "-mt-[0.1em] text-[2rem] leading-none text-text transition-colors duration-250",
          { "text-sub": isFocusMode() },
        )}
        data-ui-element="logoText"
      >
        {BRAND.logoText}
      </h1>
    </Link>
  );
}
