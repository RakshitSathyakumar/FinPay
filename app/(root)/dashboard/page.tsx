"use client";

import Dashboard from "@/components/Dashboard";
import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  budget: z.string().min(1, "Amount is Required"),
  type: z.enum(["weekly", "monthly", "yearly", "none"], {
    required_error: "You need to select a type",
  }),
  notify: z.enum(["yes", "no"]),
});

const Page = () => {
  const [formData, setFormData] = useState({
    budget: "0",
    type: "none",
    notify: "no",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: "",
      type: "none",
      notify: "yes",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setFormData(data);
  };

  return (
    <>
      <section className="p-[5%]">
        <div className="header-box">
          <h1 className="header-box-title">
            User 
            <span className="text-amazonOrange-1">{" "}Dashboard</span>
          </h1>
          <p className="header-box-subtext">See your spendings</p>
        </div>
        <div className="bg-grey-100 flex flex-center items-center justify-center">
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="secondary"
                className="bg-amazonOrange-1 text-amazonBlack-1 px-4 py-2 rounded"
              >
                Budget
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-blue-50 text-lg">
              <div className="mx-auto justify-centre flex flex-col max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Set Your Budget</DrawerTitle>
                  <DrawerDescription>
                    Set your budget to view your data
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col justify-center mx-auto">
                  <div className="flex flex-row my-4">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem className="py-4">
                              <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                Enter Your Budget
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Your Budget"
                                  className="input-class w-full border border-gray-300 rounded p-2"
                                  type="number"
                                  min={0}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-12 text-red-500" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Checkout for</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-row space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                      <RadioGroupItem value="weekly" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Weekly
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                      <RadioGroupItem value="monthly" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Monthly
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                      <RadioGroupItem value="yearly" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yearly
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notify"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Want us to Notify?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-row space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Yes
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      No
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DrawerFooter>
                          <DrawerClose asChild>
                            <div className="payment-transfer_btn-box mt-4">
                              <Button
                                type="submit"
                                className="payment-transfer_btn bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                Submit
                              </Button>
                            </div>
                          </DrawerClose>
                        </DrawerFooter>
                      </form>
                    </Form>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-300 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </section>
      {formData.type === "none" ? (
        <></>
      ) : (
        <Dashboard
          type={formData.type}
          notify={formData.notify}
          budget={formData.budget}
        />
      )}
    </>
  );
};

export default Page;
