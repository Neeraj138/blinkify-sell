import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useState } from "preact/hooks";
import { navigate } from "wouter-preact/use-browser-location";

const productFormSchema = z.object({
  merchantUserName: z
    .string()
    .min(8, {
      message: "Merchant user name must be at least 8 characters long",
    })
    .max(50, { message: "Merchant user name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Merchant user name can only contain uppercase, lowercase letters, numbers, and underscores",
    })
    .trim(),

  merchantEmail: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),

  productName: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters long" })
    .max(50, { message: "Product name cannot exceed 50 characters" })
    .trim(),

  productTitle: z
    .string()
    .min(2, { message: "Product title must be at least 2 characters long" })
    .max(250, { message: "Product title cannot exceed 250 characters" })
    .trim(),

  productDescription: z
    .string()
    .min(10, {
      message: "Product Description must be at least 1000 characters long",
    })
    .max(1000, { message: "Product Description cannot exceed 1000 characters" })
    .trim(),

  productImageUrl: z.string().url({ message: "Please enter a valid URL" }),

  productPrice: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" })
    .max(1000000, { message: "Price is unreasonably high" })
    .refine((value) => Number.isInteger(value * 10000), {
      message: "Price can have up to 4 decimal places only",
    }),
});

const AddProductForm = (props) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productForm = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      merchantUserName: "",
      merchantEmail: "abc@xyz.com",
      productName: "",
      productTitle: "",
      productDescription: "",
      productImageUrl: "",
      productPrice: 0,
    },
  });

  async function onSubmit(values) {
    if (props?.merchantWalletAddress) {
      const merchantWalletAddress = props.merchantWalletAddress;
      const productUUID = uuidv4();
      const productPayload = {
        ...values,
        merchantWalletAddress,
        productUUID,
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_DB_BASE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productPayload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Submitted Product:", data);
        console.log("Navigating");
        navigate("/addProductSuccess", {
          state: {
            details: productPayload,
          },
        });
      } catch (error) {
        console.error("Error submitting product:", error);
        toast({
          variant: "destructive",
          title: "Submission failed.",
          description: error.message,
        });
      }
    } else {
      console.log("Wallet not found");
      toast({
        variant: "destructive",
        title: "Wallet not connected.",
        description: "Please connect to wallet and submit form again.",
      });
    }
  }

  return (
    <div>
      <Form {...productForm}>
        <form
          onSubmit={productForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={productForm.control}
            name="merchantUserName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter merchant username" {...field} />
                </FormControl>
                <FormDescription>
                  8-50 characters. Only letters, numbers, and underscores
                  allowed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="merchantEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter merchant email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="productTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter detailed product description"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a comprehensive description of the product (10-1000
                  characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="productImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a valid URL for the product image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={productForm.control}
            name="productPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    {...field}
                    // Convert string to number
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter the product price in USD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Add Product
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProductForm;
