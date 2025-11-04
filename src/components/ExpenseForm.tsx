import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  projectName: z.string().min(1, "Project name is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  modeOfPayment: z.string().min(1, "Mode of payment is required"),
  expenseHead: z.string().min(1, "Expense head is required"),
  description1: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  description2: z.string().max(500, "Description must be less than 500 characters").optional(),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  billType: z.enum(["including", "excluding"], {
    required_error: "Please select bill type",
  }),
  billPhoto: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const projects = [
  { id: "meki-nashik", label: "MEKI - Nashik" },
  { id: "temple-jamner", label: "Temple - Jamner" },
  { id: "kolhapur", label: "Kolhapur" },
  { id: "other", label: "Other" },
];

const employees = [
  { id: "sameer-nagmokar", label: "Mr. Sameer Nagmokar" },
  { id: "rahul-pawar", label: "Mr. Rahul Pawar" },
  { id: "sandip", label: "Mr. Sandip" },
  { id: "omkar-lonishte", label: "Mr. Omkar Lonishte" },
  { id: "vishwas-khandagale", label: "Mr. Vishwas Khandagale" },
  { id: "other", label: "Other" },
];

const paymentModes = [
  { id: "upi", label: "UPI (G Pay, PhonePe, etc)" },
  { id: "cash", label: "Cash" },
  { id: "neft", label: "Net Banking (NEFT, RTGS, etc)" },
];

const expenseHeads = [
  { value: "material", label: "Material" },
  { value: "labour", label: "Labour" },
  { value: "transportation", label: "Transportation" },
  { value: "equipment", label: "Equipment Rental" },
  { value: "fuel", label: "Fuel" },
  { value: "food", label: "Food & Beverage" },
  { value: "accommodation", label: "Accommodation" },
  { value: "utilities", label: "Utilities" },
  { value: "maintenance", label: "Maintenance" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

export default function ExpenseForm() {
  const [expenseHeadOpen, setExpenseHeadOpen] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      employeeName: "",
      modeOfPayment: "",
      expenseHead: "",
      description1: "",
      description2: "",
      amount: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast.success("Expense submitted successfully!", {
      description: `Amount: ₹${data.amount} - ${data.expenseHead}`,
    });
    form.reset();
    setFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue("billPhoto", file);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Expense Submission</CardTitle>
        <CardDescription>Submit your project expenses with detailed information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2020-01-01")
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Name */}
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={project.id} id={project.id} />
                          <label
                            htmlFor={project.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {project.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Name */}
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Employee Name *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {employees.map((employee) => (
                        <div key={employee.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={employee.id} id={employee.id} />
                          <label
                            htmlFor={employee.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {employee.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mode of Payment */}
            <FormField
              control={form.control}
              name="modeOfPayment"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Mode of Payment *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {paymentModes.map((mode) => (
                        <div key={mode.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={mode.id} id={mode.id} />
                          <label
                            htmlFor={mode.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {mode.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expense Head - Searchable Dropdown */}
            <FormField
              control={form.control}
              name="expenseHead"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expense Head *</FormLabel>
                  <Popover open={expenseHeadOpen} onOpenChange={setExpenseHeadOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? expenseHeads.find(
                                (expense) => expense.value === field.value
                              )?.label
                            : "Select expense category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search expense category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {expenseHeads.map((expense) => (
                              <CommandItem
                                value={expense.label}
                                key={expense.value}
                                onSelect={() => {
                                  form.setValue("expenseHead", expense.value);
                                  setExpenseHeadOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    expense.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {expense.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description 1 */}
            <FormField
              control={form.control}
              name="description1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description 1 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed description of the expense"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description 2 */}
            <FormField
              control={form.control}
              name="description2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description 2 (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional details if needed"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bill Type */}
            <FormField
              control={form.control}
              name="billType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Bill *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="including" id="including" />
                        <label
                          htmlFor="including"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Including GST
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excluding" id="excluding" />
                        <label
                          htmlFor="excluding"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Without GST
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bill Photo */}
            <FormItem>
              <FormLabel>Bill Photo (Optional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="bill-upload"
                  />
                  <label htmlFor="bill-upload">
                    <Button type="button" variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                  {fileName && (
                    <span className="text-sm text-muted-foreground truncate">
                      {fileName}
                    </span>
                  )}
                </div>
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Upload up to 10 MB per file. Max 10 MB per file.
              </p>
            </FormItem>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              Submit Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
