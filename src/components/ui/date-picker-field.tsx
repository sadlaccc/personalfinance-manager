import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
  placeholder?: string;
  displayFormat?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
  id?: string;
}

/**
 * Standardized date picker with Clear/Cancel/OK confirmation flow.
 * Validates required selection on OK and emits an inline error when empty.
 */
export function DatePickerField({
  value,
  onChange,
  required = false,
  error = null,
  onErrorChange,
  placeholder = 'Pick a date',
  displayFormat = 'MMM d, yyyy',
  className,
  disabled,
  id,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | undefined>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const handleOk = () => {
    if (required && !draft) {
      onErrorChange?.('Please select a date');
      return;
    }
    onChange(draft);
    onErrorChange?.(null);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft(undefined);
    if (!required) {
      onChange(undefined);
      onErrorChange?.(null);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-invalid={!!error}
            className={cn(
              'w-full justify-start text-left font-normal rounded-xl',
              !value && 'text-muted-foreground',
              error && 'border-destructive',
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, displayFormat) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={draft}
            onSelect={setDraft}
            disabled={disabled}
            initialFocus
            className="p-3 pointer-events-auto"
          />
          <div className="flex justify-end gap-2 border-t p-2">
            <Button size="sm" variant="ghost" type="button" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={handleOk}>
              OK
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
