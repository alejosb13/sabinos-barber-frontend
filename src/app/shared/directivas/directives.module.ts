import { NgModule } from '@angular/core';
import { OnlyNumbersDirective } from './only-numbers.directive';
import { PasteOnlyNumDirective } from './paste-only-numbers.directive';
import { OnlyCharactersDirective } from './only-characters.directive';
import { OnlyAlphanumericDirective } from './only-alphanumeric.directive';
import { OnlyDecimalsDirective } from './only-decimals.directive';
import { OnlyNumberAndPointDirective } from './only-number-and-point.directive';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { OnlyEmailCharactersDirective } from './only-email-characters.directive';

@NgModule({
  imports: [BlockCopyPasteDirective],
  declarations: [
    OnlyNumbersDirective,
    PasteOnlyNumDirective,
    OnlyCharactersDirective,
    OnlyAlphanumericDirective,
    OnlyDecimalsDirective,
    OnlyNumberAndPointDirective,
    OnlyEmailCharactersDirective,
  ],
  exports: [
    OnlyNumbersDirective,
    BlockCopyPasteDirective,
    PasteOnlyNumDirective,
    OnlyCharactersDirective,
    OnlyAlphanumericDirective,
    OnlyDecimalsDirective,
    OnlyNumberAndPointDirective,
    OnlyEmailCharactersDirective,
  ],
})
export class DirectivesModule {}
