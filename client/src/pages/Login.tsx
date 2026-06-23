import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { useState } from "react";
import { useUserStore } from "@/store/user.store";
import { useNavigate } from "react-router";
import { MoveLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email) return;

    const credentials = { email, password };
    try {
      const response = await api.login(credentials);

      if (response) {
        login({
          id: response.user._id,
          username: response.user.username,
          name: response.user.name,
          email: response.user.email,
          token: response.token,
        });

        navigate("/receptionist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar noLogout />
      <div className={cn("flex flex-col gap-6 w-full max-w-100 mx-auto mt-20")}>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="w-fit"
        >
          <MoveLeft className="size-4 text-muted-foreground" />
          Back to Home
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldDescription className="text-sm">
                  For demo use: <span className="font-mono">abcd@mail.com</span>
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="gap-1">
                  Password <span className="text-red-800">*</span>
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Type password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FieldDescription className="text-sm">
                  For demo use: <span className="font-mono">12345678</span>
                </FieldDescription>
              </Field>
              <Field>
                <Button onClick={handleLogin}>Login</Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
