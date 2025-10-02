import {
  faFileInvoiceDollar,
  faCartPlus,
  faKey,
  faHandHoldingDollar,
  faPersonCircleCheck,
  faEye,
  faChevronDown,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

const formatTemplate = (data: any) =>
  `<path fill='var(--ci-primary-color, currentColor)' d='${data}' class='ci-primary'/></svg> `;

export const CUSTOM_ICONS = {
  faFileInvoiceDollar: [
    `${faFileInvoiceDollar.icon[0]} ${faFileInvoiceDollar.icon[1]}`,
    formatTemplate(faFileInvoiceDollar.icon[4]),
  ],
  faCartPlus: [
    `${faCartPlus.icon[0]} ${faCartPlus.icon[1]}`,
    formatTemplate(faCartPlus.icon[4]),
  ],
  faKey: [`${faKey.icon[0]} ${faKey.icon[1]}`, formatTemplate(faKey.icon[4])],
  faPersonCircleCheck: [
    `${faPersonCircleCheck.icon[0]} ${faPersonCircleCheck.icon[1]}`,
    formatTemplate(faPersonCircleCheck.icon[4]),
  ],
  faHandHoldingDollar: [
    `${faHandHoldingDollar.icon[0]} ${faHandHoldingDollar.icon[1]}`,
    formatTemplate(faHandHoldingDollar.icon[4]),
  ],
  faEye: [`${faEye.icon[0]} ${faEye.icon[1]}`, formatTemplate(faEye.icon[4])],
  faChevronDown: [
    `${faChevronDown.icon[0]} ${faChevronDown.icon[1]}`,
    formatTemplate(faChevronDown.icon[4]),
  ],
  faCalendarAlt: [
    `${faCalendarAlt.icon[0]} ${faCalendarAlt.icon[1]}`,
    formatTemplate(faCalendarAlt.icon[4]),
  ],
};
