import ExpenseForm from "@/components/ExpenseForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Expense Management</h1>
          <p className="text-lg text-muted-foreground">
            Track and submit your project expenses efficiently
          </p>
        </div>
        <ExpenseForm />
      </div>
    </div>
  );
};

export default Index;
