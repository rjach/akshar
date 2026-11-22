import { JSXElement } from "solid-js";

import { getRoutePage } from "../../../states/router";
import { isFocusMode } from "../../../states/test";
import { restartTest } from "../../../test/test-logic";
import { cn } from "../../../utils/cn";
import { Button } from "../../common/Button";

export function Nav(): JSXElement {
  const buttonClass = () =>
    cn("aspect-square", {
      "opacity-(--nav-focus-opacity)": isFocusMode(),
    });

  return (
    <nav class={cn("z-5 flex w-full items-center gap-1 md:gap-2")}>
      <Button
        variant="text"
        fa={{
          icon: "fa-keyboard",
          fixedWidth: true,
        }}
        to="/"
        class={buttonClass()}
        dataset={{
          "data-nav-item": "test",
        }}
        balloon={{ text: "test", position: "down" }}
        onClick={() => {
          if (getRoutePage() === "test") void restartTest();
        }}
      />
      <Button
        variant="text"
        fa={{
          icon: "fa-chart-line",
          fixedWidth: true,
        }}
        dataset={{
          "data-nav-item": "stats",
        }}
        balloon={{ text: "your stats", position: "down" }}
        class={buttonClass()}
        to="/stats"
      />
      <Button
        variant="text"
        fa={{
          icon: "fa-info",
          fixedWidth: true,
        }}
        class={buttonClass()}
        dataset={{
          "data-nav-item": "about",
        }}
        balloon={{ text: "about", position: "down" }}
        to="/about"
      />
      <Button
        variant="text"
        fa={{
          icon: "fa-cog",
          fixedWidth: true,
        }}
        class={buttonClass()}
        to="/settings"
        dataset={{
          "data-nav-item": "settings",
        }}
        balloon={{ text: "settings", position: "down" }}
      />
    </nav>
  );
}
