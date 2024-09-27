import { ListFilter, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";

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

const TransactionHistory = () => {
  return (
    <div className="flex w-full max-w-7xl mx-auto flex-col border rounded-xl shadow">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="savings">Savings</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Payment Type</TableHead>
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
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">
                          <img
                            alt="Transaction image"
                            className="aspect-square rounded-full object-cover"
                            height="64"
                            width="64"
                            src="/placeholder.png"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          Grocery Shopping
                        </TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Expenses</Badge>
                        </TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell className="hidden md:table-cell">
                          2024-09-20
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          New York
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
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
