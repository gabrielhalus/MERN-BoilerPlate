import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRegisterSchema } from "@/lib/zod/schemas/auth/zod";
import { useAuthContext } from "@/contexts/authContext";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { useConfigContext } from "@/contexts/configContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const RegisterGoogleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const userData = location.state;

  useEffect(() => {
    if (!userData) {
      navigate("/login", { replace: true });
    }
  }, [userData, navigate]);

  if (!userData) return null;

  const { name, email, photoURL } = userData;

  const registerSchema = getRegisterSchema(t);
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: name.split(" ").slice(1).join(" ") || "",
      forename: name.split(" ")[0] || "",
      username: name.replace(/\s+/g, "").toLowerCase(),
      email: email,
      password: "",
      confirmPassword: "",
      photoURL: photoURL,
    },
  });

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      const response = await axiosConfig.post("/auth/register/", values);
      toast.success(t(response.data.message));
      setAuthUser(response.data.user);
      navigate("/");
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  }

  const { getConfigValue } = useConfigContext();
  const [configValues, setConfigValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchConfigValues = async () => {
      const values = await getConfigValue(["APP_NAME"]);
      setConfigValues(values);
    };

    fetchConfigValues();
  }, [getConfigValue]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-2xl gap-6 px-4 md:px-0">
        <div className="flex items-center self-center gap-2 text-2xl font-medium sm:text-4xl text-accent">{configValues["APP_NAME"]}</div>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">{t("pages.register.title")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(register)} className="w-full space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <FormField
                    control={registerForm.control}
                    name="forename"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("pages.register.forename")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("pages.register.name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.register.username")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{t("pages.register.username_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.register.email")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={true} />
                      </FormControl>
                      <FormDescription>{t("pages.register.email_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.register.password")}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>{t("pages.register.password_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.register.confirm_password")}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>{t("pages.register.confirm_password_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {t("pages.register.register")}
                </Button>
              </form>
            </Form>
            <div className="text-sm text-center md:text-base">
              {t("pages.register.already_have_account")}{" "}
              <Link to="/login" className="underline underline-offset-4">
                {t("pages.register.login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
