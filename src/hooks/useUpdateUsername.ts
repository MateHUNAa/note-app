import { useMutation } from "@tanstack/react-query";
import { UsernameValidator } from "@/lib/validators/username";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
export function useUpdateUsername(newUsername: string) {
  const { toast } = useToast();
  return useMutation(async (newUsername: string) => {
    try {
      const { username: validatedName } = UsernameValidator.parse({
        name: newUsername,
      });

      const response = await axios.patch("/api/username", {
        username: validatedName,
      });

      return response.data;
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  }, {
     onSuccess: (data) => {
          toast({
          title: "Success!",
          description: "Your username has been updated.",
          });
     },
     onError: (error) => {
          toast({
          title: "Something went wrong!",
          description: "Please try again later!",
          variant: "destructive",
          });
     }

  });
}
