import { JSXElement } from "solid-js";

import { CommandlineModal } from "./CommandlineModal";
import { ContactModal } from "./ContactModal";
import { CustomTestDurationModal } from "./CustomTestDurationModal";
import { CustomTextModal } from "./CustomTextModal";
import { CustomWordAmountModal } from "./CustomWordAmountModal";
import { MobileTestConfigModal } from "./MobileTestConfigModal";
import { PractiseWordsModal } from "./PractiseWordsModal";
import { QuoteSearchModal } from "./QuoteSearchModal";
import { ShareTestSettings } from "./ShareTestSettings";
import { SimpleModal } from "./SimpleModal";
import { TheRestModal } from "./TheRestModal";

export function Modals(): JSXElement {
  return (
    <>
      <CommandlineModal />
      <ContactModal />
      <SimpleModal />
      <CustomTextModal />
      <QuoteSearchModal />
      <CustomTestDurationModal />
      <CustomWordAmountModal />
      <PractiseWordsModal />
      <ShareTestSettings />
      <MobileTestConfigModal />
      <TheRestModal />
    </>
  );
}
