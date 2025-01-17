import { Edit, ListFilter, MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "@/graphql/queries/transaction.query";
import { Skeleton } from "./ui/skeleton";
import { DELETE_TRANSACTION } from "@/graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { FaMoneyCheckDollar, FaSackDollar } from "react-icons/fa6";
import { RiExchangeDollarLine } from "react-icons/ri";

interface ITransaction {
  _id: string;
  description: string;
  paymentType: "cash" | "card";
  category: "saving" | "expense" | "investment";
  amount: number;
  date: string;
  location: string;
}

const TransactionHistory = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_TRANSACTIONS);

  const [deleteTransaction, { loading: deleteLoading }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
    }
  );

  const transactions: ITransaction[] = data?.transactions || [];

  const handleEdit = (transactionId: string) => {
    // console.log(transactionId);
    navigate(`/transaction/${transactionId}`);
  };
  const handleDelete = async (transactionId: string) => {
    try {
      await deleteTransaction({
        variables: {
          transactionId,
        },
      });
      toast.success("Transaction deleted!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString("en-US"); // Converts to "MM/DD/YYYY"
  };

  if (error) {
    return (
      <div className="flex w-full max-w-7xl mx-auto flex-col border rounded-xl shadow">
        <div className="p-4 text-center space-y-5 py-10">
          <h2 className="text-xl font-bold">Error Loading Transactions</h2>
          <p className="text-red-600">
            Failed to load transactions data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-7xl mx-auto flex-col border rounded-xl shadow">
      <div className="flex flex-col sm:gap-4 sm:p-4">
        <main className="grid flex-1 items-start gap-4 p-1 sm:p-4 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="savings">Savings</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => navigate("/transactions")}
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* All Data Tab */}
            <TabsContent value="all" className="mt-5">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Manage your transactions and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[70px] lg:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Payment Type
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Location
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && <SkeletonLoader></SkeletonLoader>}

                      {!loading &&
                        transactions.map(transaction => {
                          const {
                            _id,
                            amount,
                            category,
                            date,
                            description,
                            location: transactionLocation,
                            paymentType,
                          } = transaction;
                          const formattedDate = formatDate(date);
                          const location =
                            transactionLocation &&
                            transactionLocation.trim() !== ""
                              ? transactionLocation
                              : "N/A";
                          return (
                            <TableRow key={_id}>
                              <TableCell className="hidden lg:table-cell">
                                <img
                                  alt="Transaction image"
                                  className="aspect-square rounded-full object-cover"
                                  height="50"
                                  width="50"
                                  src="/placeholder.png"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p className="truncate w-20 lg:w-44">
                                        {description}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell capitalize">
                                {paymentType === "card" ? (
                                  <p className="flex items-center justify-start gap-2">
                                    <FaMoneyCheckDollar className="w-4 h-4 ml-5 md:ml-0"></FaMoneyCheckDollar>
                                    <span className="hidden md:block">
                                      {paymentType}
                                    </span>
                                  </p>
                                ) : (
                                  <p className="flex items-center justify-start gap-2">
                                    <FaSackDollar className="w-4 h-4 ml-5 md:ml-0"></FaSackDollar>
                                    <span className="hidden md:block">
                                      {paymentType}
                                    </span>
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                {category === "expense" && (
                                  <Badge
                                    variant="destructive"
                                    className="capitalize"
                                  >
                                    <RiExchangeDollarLine className="w-4 h-4 lg:mr-1"></RiExchangeDollarLine>
                                    <span className="hidden lg:block">
                                      {category}
                                    </span>
                                  </Badge>
                                )}
                                {category === "investment" && (
                                  <Badge
                                    variant="investment"
                                    className="capitalize text-white"
                                  >
                                    <RiExchangeDollarLine className="w-4 h-4 lg:mr-1"></RiExchangeDollarLine>
                                    <span className="hidden lg:block">
                                      {category}
                                    </span>
                                  </Badge>
                                )}
                                {category === "saving" && (
                                  <Badge
                                    variant="saving"
                                    className="capitalize text-white"
                                  >
                                    <RiExchangeDollarLine className="w-4 h-4 lg:mr-1"></RiExchangeDollarLine>
                                    <span className="hidden lg:block">
                                      {category}
                                    </span>
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <strong>${amount.toLocaleString()}</strong>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formattedDate}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p className="truncate w-20 lg:w-32">
                                        {location}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{location}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="text-muted-foreground">
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator></DropdownMenuSeparator>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEdit(transaction._id)
                                      }
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      Edit <Edit className="w-4 h-4"></Edit>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator></DropdownMenuSeparator>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDelete(transaction._id)
                                      }
                                      disabled={deleteLoading}
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      Delete
                                      <Trash2 className="w-4 h-4"></Trash2>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                  {transactions.length <= 0 && (
                    <div className="p-4 text-center space-y-5 py-10">
                      <h2 className="text-lg text-muted-foreground">
                        No Transactions
                      </h2>
                      <p className="text-muted-foreground font-bold">
                        Spend Nicely, Track Wisely
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-2</strong> of <strong>2</strong>{" "}
                    transactions
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Saving Data Tab */}
            <TabsContent value="savings" className="mt-5">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Manage your transactions and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[70px] lg:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Payment Type
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Location
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sample transaction data */}
                      {loading && <SkeletonLoader></SkeletonLoader>}

                      {!loading &&
                        transactions
                          .filter(
                            transaction => transaction.category === "saving"
                          )
                          .map(transaction => {
                            const {
                              _id,
                              amount,
                              category,
                              date,
                              description,
                              location: transactionLocation,
                              paymentType,
                            } = transaction;
                            const formattedDate = formatDate(date);

                            const location =
                              transactionLocation &&
                              transactionLocation.trim() !== ""
                                ? transactionLocation
                                : "N/A";
                            return (
                              <TableRow key={_id}>
                                <TableCell className="hidden lg:table-cell">
                                  <img
                                    alt="Transaction image"
                                    className="aspect-square rounded-full object-cover"
                                    height="50"
                                    width="50"
                                    src="/placeholder.png"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate w-20 lg:w-44">
                                          {description}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell capitalize">
                                  {paymentType === "card" ? (
                                    <p className="flex items-center justify-start gap-2">
                                      <FaMoneyCheckDollar className="w-4 h-4 ml-5 md:ml-0"></FaMoneyCheckDollar>
                                      <span className="hidden md:block">
                                        {paymentType}
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="flex items-center justify-start gap-2">
                                      <FaSackDollar className="w-4 h-4 ml-5 md:ml-0"></FaSackDollar>
                                      <span className="hidden md:block">
                                        {paymentType}
                                      </span>
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category === "saving" && (
                                    <Badge
                                      variant="saving"
                                      className="capitalize text-white"
                                    >
                                      <RiExchangeDollarLine className="w-4 h-4 lg:mr-1"></RiExchangeDollarLine>
                                      <span className="hidden lg:block">
                                        {category}
                                      </span>
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <strong>${amount.toLocaleString()}</strong>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {formattedDate}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate w-20 lg:w-44">
                                          {location}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{location}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel className="text-muted-foreground">
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator></DropdownMenuSeparator>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleEdit(transaction._id)
                                        }
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        Edit <Edit className="w-4 h-4"></Edit>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator></DropdownMenuSeparator>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDelete(transaction._id)
                                        }
                                        disabled={deleteLoading}
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        Delete
                                        <Trash2 className="w-4 h-4"></Trash2>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                  {transactions.filter(
                    transaction => transaction.category === "saving"
                  ).length <= 0 && (
                    <div className="p-4 text-center space-y-5 py-10">
                      <p className="text-sm text-muted-foreground">
                        No Transactions
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-2</strong> of <strong>2</strong>{" "}
                    transactions
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Expense Data Tab */}
            <TabsContent value="expenses" className="mt-5">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Manage your transactions and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[70px] lg:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Payment Type
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Location
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sample transaction data */}
                      {loading && <SkeletonLoader></SkeletonLoader>}

                      {!loading &&
                        transactions
                          .filter(
                            transaction => transaction.category === "expense"
                          )
                          .map(transaction => {
                            const {
                              _id,
                              amount,
                              category,
                              date,
                              description,
                              location: transactionLocation,
                              paymentType,
                            } = transaction;
                            const formattedDate = formatDate(date);
                            const location =
                              transactionLocation &&
                              transactionLocation.trim() !== ""
                                ? transactionLocation
                                : "N/A";
                            return (
                              <TableRow key={_id}>
                                <TableCell className="hidden lg:table-cell">
                                  <img
                                    alt="Transaction image"
                                    className="aspect-square rounded-full object-cover"
                                    height="50"
                                    width="50"
                                    src="/placeholder.png"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate w-20 lg:w-44">
                                          {description}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell capitalize">
                                  {paymentType === "card" ? (
                                    <p className="flex items-center justify-start gap-2">
                                      <FaMoneyCheckDollar className="w-4 h-4 ml-5 md:ml-0"></FaMoneyCheckDollar>
                                      <span className="hidden md:block">
                                        {paymentType}
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="flex items-center justify-start gap-2">
                                      <FaSackDollar className="w-4 h-4 ml-5 md:ml-0"></FaSackDollar>
                                      <span className="hidden md:block">
                                        {paymentType}
                                      </span>
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category === "expense" && (
                                    <Badge
                                      variant="destructive"
                                      className="capitalize"
                                    >
                                      <RiExchangeDollarLine className="w-4 h-4 lg:mr-1"></RiExchangeDollarLine>
                                      <span className="hidden lg:block">
                                        {category}
                                      </span>
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <strong>${amount.toLocaleString()}</strong>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {formattedDate}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate w-20 lg:w-32">
                                          {location}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{location}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel className="text-muted-foreground">
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator></DropdownMenuSeparator>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleEdit(transaction._id)
                                        }
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        Edit <Edit className="w-4 h-4"></Edit>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator></DropdownMenuSeparator>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDelete(transaction._id)
                                        }
                                        disabled={deleteLoading}
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        Delete
                                        <Trash2 className="w-4 h-4"></Trash2>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                  {transactions.filter(
                    transaction => transaction.category === "expense"
                  ).length <= 0 && (
                    <div className="p-4 text-center space-y-5 py-10">
                      <p className="text-sm text-muted-foreground">
                        No Transactions
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-2</strong> of <strong>2</strong>{" "}
                    transactions
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Investments Data Tab */}
            <TabsContent value="investments" className="mt-5">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Manage your transactions and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[70px] lg:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Payment Type
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Location
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sample transaction data */}
                      {loading && <SkeletonLoader></SkeletonLoader>}

                      {!loading &&
                        transactions
                          .filter(
                            transaction => transaction.category === "investment"
                          )
                          .map(transaction => {
                            const {
                              _id,
                              amount,
                              category,
                              date,
                              description,
                              location: transactionLocation,
                              paymentType,
                            } = transaction;
                            const formattedDate = formatDate(date);

                            const location =
                              transactionLocation &&
                              transactionLocation.trim() !== ""
                                ? transactionLocation
                                : "N/A";
                            return (
                              <TableRow key={_id}>
                                <TableCell className="hidden lg:table-cell">
                                  <img
                                    alt="Transaction image"
                                    className="aspect-square rounded-full object-cover"
                                    height="50"
                                    width="50"
                                    src="/placeholder.png"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate w-20 lg:w-44">
                                          {description}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell capitalize">
                                  {paymentType === "card" ? (
                                    <p className="flex items-center justify-start gap-2">
                                      <FaMoneyCheckDollar className="w-4 h-4 ml-5 md:ml-0"></FaMoneyCheckDollar>
                                      <span className="hidden md:block">
                                        {paymentType}
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="flex items-center justify-start gap-2">
                                      <FaSackDollar className="w-4 h-4 ml-5 md:ml-0"></FaSackDollar>
                                      <span className="hidden md:block">
                                        {paymentType}
                                      </span>
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {category === "investment" && (
                                    <Badge
                                      variant="investment"
                                      className="capitalize text-white"
                                    >
                                      <RiExchangeDollarLine className="w-4 h-4 lg:mr-1"></RiExchangeDollarLine>
                                      <span className="hidden lg:block">
                                        {category}
                                      </span>
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <strong>${amount.toLocaleString()}</strong>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {formattedDate}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="truncate w-20 lg:w-32">
                                          {location}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{location}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel className="text-muted-foreground">
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator></DropdownMenuSeparator>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleEdit(transaction._id)
                                        }
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        Edit <Edit className="w-4 h-4"></Edit>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator></DropdownMenuSeparator>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDelete(transaction._id)
                                        }
                                        disabled={deleteLoading}
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        Delete
                                        <Trash2 className="w-4 h-4"></Trash2>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                  {transactions.filter(
                    transaction => transaction.category === "investment"
                  ).length <= 0 && (
                    <div className="p-4 text-center space-y-5 py-10">
                      <p className="text-sm text-muted-foreground">
                        No Transactions
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-2</strong> of <strong>2</strong>{" "}
                    transactions
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default TransactionHistory;

const SkeletonLoader = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="hidden sm:table-cell">
            <Skeleton className="h-20 w-20 rounded-full" />
          </TableCell>
          <TableCell className="font-medium">
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end"></DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
