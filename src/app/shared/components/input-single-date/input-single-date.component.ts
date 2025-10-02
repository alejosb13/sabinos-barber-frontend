import { CommonModule } from '@angular/common';
import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import {
  NgbCalendar,
  NgbDate,
  NgbInputDatepicker,
  NgbDatepicker,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import logger from 'src/app/shared/utils/logger';

dayjs.locale('es');

// Formateo personalizado para ng-bootstrap
@Injectable()
class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '-';

  parse(value: string): NgbDate | null {
    if (value) {
      const parts = value.split(this.DELIMITER);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new NgbDate(year, month, day);
        }
      }
    }
    return null;
  }

  format(date: NgbDate | null): string {
    if (date && !isNaN(date.year) && !isNaN(date.month) && !isNaN(date.day)) {
      return (
        date.day.toString().padStart(2, '0') +
        this.DELIMITER +
        date.month.toString().padStart(2, '0') +
        this.DELIMITER +
        date.year
      );
    }
    return '';
  }
}

@Component({
  selector: 'app-input-single-date',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormModule,
    NgbInputDatepicker,
    NgbDatepicker,
    IconDirective,
  ],
  templateUrl: './input-single-date.component.html',
  styleUrl: './input-single-date.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class InputSingleDateComponent implements OnInit, OnChanges {
  @Input() textLabel!: string;
  @Input() selectedDate!: string | Dayjs;
  @Output() selectedDateChange = new EventEmitter<string>();

  @Input() floatingInput: boolean = false;

  // NgBootstrap date model
  model: NgbDate | null = null;

  // ID único para evitar conflictos
  componentId = Math.random().toString(36).substr(2, 9);

  constructor(private calendar: NgbCalendar) {}

  ngOnInit(): void {
    // Convertir selectedDate inicial a NgbDate
    if (this.selectedDate) {
      this.updateModelFromSelectedDate();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      this.updateModelFromSelectedDate();
      logger.log(
        this.textLabel,
        'selectedDate actualizado a:',
        dayjs.isDayjs(this.selectedDate)
          ? this.selectedDate.format('YYYY-MM-DD')
          : this.selectedDate
      );
    }
  }

  private updateModelFromSelectedDate(): void {
    if (this.selectedDate) {
      let date: Dayjs;
      if (dayjs.isDayjs(this.selectedDate)) {
        date = this.selectedDate;
      } else {
        date = dayjs(this.selectedDate);
      }

      this.model = new NgbDate(date.year(), date.month() + 1, date.date());
    }
  }

  onDateSelect(date: NgbDate | null): void {
    if (date) {
      // Convertir NgbDate a string formato YYYY-MM-DD para el backend
      const selectedDateString = `${date.year}-${date.month
        .toString()
        .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
      this.selectedDateChange.emit(selectedDateString);
      logger.log(this.textLabel, 'fecha seleccionada:', selectedDateString);
    }
  }
}
