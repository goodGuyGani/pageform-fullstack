"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createUserSchemaType, createUserSchema } from "@/schemas/createUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createUser, getUser } from "@/actions/user";
import { toast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import prisma from "@/lib/prisma";
import { createCookie } from "@/actions/session";

function Page() {
  const form = useForm<createUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {},
  });

  const router = useRouter();
  const [onLogin, setOnLogin] = useState(true);

  const [isEmail, setIsEmail] = useState("");
  const [isPassword, setIsPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const valueChangeClick = () => {
    if (onLogin) return setOnLogin(false);
    if (!onLogin) return setOnLogin(true);
  };

  const onSubmit = async (data: createUserSchemaType) => {
    try {
      await createUser(data);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      form.reset();
      setOnLogin(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  async function toLogin() {
    setIsLoading(true);

    try {
      const account = await getUser(isEmail, isPassword);

      if (account?.email === isEmail && account?.password === isPassword) {
        createCookie(
          account.id.toString(),
          account.email,
          `${account.firstName} ${account.lastName}`
        );
        router.prefetch("/");
        router.refresh();
        toast({
          title: "Success",
          description: "Login successful",
        });
      } else {
        toast({
          title: "Failed",
          description: "Incorrent Email and Password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEmailChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    // Update the state with the new input value
    setIsEmail(event.target.value);
  };

  const handlePasswordChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    // Update the state with the new input value
    setIsPassword(event.target.value);
  };

  function test() {
    console.log(isEmail, isPassword);
  }
  return (
    <Tabs value={onLogin ? "login" : "register"} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" onClick={valueChangeClick}>
          Login
        </TabsTrigger>
        <TabsTrigger value="register" onClick={valueChangeClick}>
          Register
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
        <form>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Login to your account, to manage and save your own personal tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="name"
                  placeholder="Enter Email"
                  onChange={handleEmailChange}
                  value={isEmail}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  onChange={handlePasswordChange}
                  value={isPassword}
                />
              </div>
            
          </CardContent>
          <CardFooter>
            <Button
              disabled={isLoading}
              className="w-full"
              variant="outline"
              onClick={toLogin}
            >
              Sign In
              {isLoading && (
                <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Account Creation</CardTitle>
            <CardDescription>
              Create your account to manage your own personal tasks.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="flex">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>&nbsp;</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            
          </Form>
          <CardFooter>
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full"
              variant="outline"
              onClick={form.handleSubmit(onSubmit)}
            >
              Sign Up
              {form.formState.isSubmitting && (
                <ReloadIcon className="animate-spin h-4 w-4 ml-2" />
              )}
            </Button>
          </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Page;
