import { Link } from "@solidjs/meta";
import { createMemo, JSXElement } from "solid-js";

import { Theme } from "../../constants/themes";
import { isDevEnvironment } from "../../utils/env";

export function FavIcon(props: { theme: Theme }): JSXElement {
  const icon = createMemo<string>(() => {
    let { main, bg } = props.theme;
    if (isDevEnvironment()) {
      [main, bg] = [bg, main];
    }
    if (bg === main) {
      bg = "#111";
      main = "#eee";
    }

    const svgPre = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <style>
        #bg{fill:${bg};}
        path{fill:${main};}
      </style>
      <g>
        <path id="bg" d="M0 16Q0 0 16 0h32q16 0 16 16v32q0 16-16 16H16Q0 64 0 48"/>
        <path transform="matrix(0.05333 0 0 -0.05333 10.453 48.853)" d="M675,551L675,0L594,0L594,551L521,551L521,622L779,622L779,551L675,551ZM299,632Q356,632 391.5,612Q427,592 443,559.5Q459,527 459,488Q459,418 407.5,374Q356,330 237,320L221,391Q284,399 318,411.5Q352,424 365.5,443Q379,462 379,489Q379,522 358,541.5Q337,561 296,561Q262,561 229.5,551Q197,541 165,521L139,591Q174,611 213.5,621.5Q253,632 299,632ZM475,216Q475,143 427,102.5Q379,62 305,62Q245,62 197.5,88.5Q150,115 109,176.5Q68,238 29,344L100,373Q141,256 187,195.5Q233,135 298,135Q342,135 369,158.5Q396,182 396,225Q396,269 364,301.5Q332,334 293,356L337,369L380,378Q394,367 411,351Q428,335 438,320L448,301Q461,282 468,260.5Q475,239 475,216ZM495,352Q530,352 569.5,359Q609,366 651,384L651,309Q617,293 582,287Q547,281 511,281Q486,281 456.5,285.5Q427,290 399,298L379,352L385,367Q411,359 440,355.5Q469,352 495,352Z"/>
      </g>
    </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svgPre)}`;
  });

  return (
    <Link id="favicon" rel="shortcut icon" type="image/svg+xml" href={icon()} />
  );
}
