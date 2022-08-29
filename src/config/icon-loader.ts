import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons/faPlayCircle';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons/faLongArrowAltDown';
import { faGripLines } from '@fortawesome/free-solid-svg-icons/faGripLines';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleRight';
import { library } from '@fortawesome/fontawesome-svg-core';

export const loadIcons = () => {
  library.add(
    faDollarSign,
    faPlus,
    faPlayCircle,
    faPhone,
    faMinus,
    faLongArrowAltDown,
    faGripLines,
    faChevronRight,
    faInfo,
    faEdit,
    faArrowAltCircleRight,
  );
};
