"use client";

import * as z from "zod";
import { store } from "@prisma/client";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingFormProps {
  initialData: store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingFormValue = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
  const form = useForm<SettingFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const param = useParams();
  const router = useRouter();
  const origin = useOrigin()

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SettingFormValue) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${param.storeId}`, data);
      router.refresh();
      toast.success("Store Updated");
    } catch (error) {
      toast.error("Something wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setOpen(true);
      await axios.delete(`/api/stores/${param.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Stores deleted.");
    } catch (error) {
      toast.error("Make sure you removed all product and categories first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className=" flex justify-between items-center">
        <Heading descriptions="Manage Store preference" title="Setting" />
        <Button
          disabled={loading}
          variant={"destructive"}
          size={"icon"}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash className=" h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
          <div className=" grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className=" ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="NEXT_PUBLIC_API_URL" descriptions={`${origin}/api/${param.storeId}`} variants="public" />
    </>
  );
};
