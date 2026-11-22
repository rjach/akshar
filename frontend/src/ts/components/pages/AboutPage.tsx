import { JSXElement } from "solid-js";

import { BRAND } from "../../constants/brand";
import { showModal } from "../../states/modals";
import { Button } from "../common/Button";
import { H2, H3 } from "../common/Headers";
import { CommandlineHotkey } from "../hotkeys/CommandlineHotkey";
import { QuickRestartHotkey } from "../hotkeys/QuickRestartHotkey";

export function AboutPage(): JSXElement {
  return (
    <div class="content-grid grid gap-8">
      <section class="text-center text-sub">
        {BRAND.nameNepali} - {BRAND.tagline}.
        <br />
        Free, no sign up. Your results never leave this browser.
      </section>
      <section>
        <H2 fa={{ icon: "fa-info-circle" }} text="about" />
        <p>
          Akshar ({BRAND.nameNepali}) is a minimalistic typing test made for
          Nepali. Type in Devanagari with the Nepali Unicode (romanized) or
          Nepali Traditional keyboard straight from any physical keyboard - no
          Nepali input method needed - or switch to English and dozens of other
          languages. It keeps everything that makes a good typing test: many
          test modes, themes, sounds, a smooth caret and real-time feedback on
          typos, speed and accuracy.
          <br />
          <br />
          There are no accounts. Your results, personal bests and settings are
          saved in this browser only (localStorage), and you can see them on the
          stats page.
        </p>
      </section>
      <section>
        <H3 fa={{ icon: "fa-align-left" }} text="word set" />
        <p>
          By default, tests use 1000 common Nepali words typed with the Nepali
          Unicode (romanized) keyboard. Pick &quot;nepali traditional&quot; for
          the Traditional keyboard, &quot;nepali&quot; to type with your own
          system keyboard, &quot;nepali romanized&quot; for Nepali written in
          Latin letters, or any other language such as English from the language
          list.
        </p>
      </section>
      <section>
        <H3 fa={{ icon: "fa-keyboard" }} text="keybinds" />
        <p>
          You can use <QuickRestartHotkey /> to restart the typing test. Open
          the command line by pressing <CommandlineHotkey /> - there you can
          access all the functionality you need without touching your mouse.
        </p>
      </section>
      <section>
        <H3 fa={{ icon: "fa-list-ol" }} text="stats" />
        <dl class="grid">
          <dt class="col-1 mr-4">wpm</dt>
          <dd class="col-2">
            - total number of characters in the correctly typed words (including
            spaces), divided by 5 and normalised to 60 seconds. Devanagari
            letters, vowel signs and halants each count as one character, so a
            conjunct like क्ष counts as three.
          </dd>

          <dt class="col-1 mr-4">raw wpm</dt>
          <dd class="col-2">
            {" "}
            - calculated just like wpm, but also includes incorrect words.
          </dd>

          <dt class="col-1 mr-4">acc</dt>
          <dd class="col-2"> - percentage of correctly pressed keys.</dd>

          <dt class="col-1 mr-4">char</dt>
          <dd class="col-2">
            - correct characters / incorrect characters. Calculated after the
            test has ended.
          </dd>

          <dt class="col-1 mr-4">consistency</dt>
          <dd class="col-2">
            - based on the variance of your raw wpm. Closer to 100% is better.
            Calculated using the coefficient of variation of raw wpm and mapped
            onto a scale from 0 to 100.
          </dd>
        </dl>
      </section>
      <section>
        <H3 fa={{ icon: "fa-shield-alt" }} text="fair results" />
        <p>
          Results typed by scripts or auto-typers (synthetic key events, or a
          perfectly even rhythm no person can keep) are marked invalid and are
          not saved. These checks run in your browser, so they keep your own
          history honest rather than police anyone else.
        </p>
      </section>
      <section>
        <H3 fa={{ icon: "fa-chart-area" }} text="results screen" />
        <p>
          After completing a test you will be able to see your wpm, raw wpm,
          accuracy, character stats, test length and test info (you can hover
          over some values to get floating point numbers). You can also see a
          graph of your wpm and raw over the duration of the test. Remember that
          the wpm line is a global average, while the raw wpm line is a local,
          momentary value (meaning if you stop, the value is 0).
        </p>
      </section>
      <section>
        <H2 fa={{ icon: "fa-envelope" }} text="contact" />
        <p>
          If you encounter a bug, have a feature request or just want to say hi
          - send us an email.
        </p>
        <div class="mt-4 grid w-full grid-cols-1 gap-4 text-xl sm:grid-cols-2 lg:grid-cols-4">
          <Button
            text="mail"
            fa={{ icon: "fa-envelope" }}
            onClick={() => showModal("Contact")}
            class="w-full p-8"
          />
        </div>
      </section>
      <section>
        <H2 fa={{ icon: "fa-users" }} text="credits" />
        <p>
          Akshar is built on
          <Button
            variant="text"
            text={BRAND.upstreamName}
            href={BRAND.upstreamUrl}
            class="p-0 pt-2 pr-2 pb-2 pl-2"
          />
          by Miodec and its contributors, released under the GPL-3.0 license.
          Akshar is released under the same license. Thanks to the
          <Button
            variant="text"
            text="Monkeytype contributors"
            href="https://github.com/monkeytypegame/monkeytype/graphs/contributors"
            class="p-0 pt-2 pr-2 pb-2 pl-2"
          />
          whose work made this possible.
        </p>
      </section>
    </div>
  );
}
