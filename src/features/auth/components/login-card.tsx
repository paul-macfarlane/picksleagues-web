import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import googleLogo from "@/assets/google.svg";
import appleBlack from "@/assets/apple-black.svg";
import appleWhite from "@/assets/apple-white.svg";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/theme-provider";
import { Trophy } from "lucide-react";

export function LoginCard() {
  const { theme } = useTheme();
  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const appleLogo = isDarkMode ? appleWhite : appleBlack;

  async function signInWithGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/api/v1/profiles/onboard",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function signInWithApple() {
    try {
      await authClient.signIn.social({
        provider: "apple",
        callbackURL: "/api/v1/profiles/onboard",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-3">
        <div className="flex justify-center">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          Sign in to Picks Leagues
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 py-6 text-base font-semibold"
          onClick={signInWithGoogle}
        >
          <img src={googleLogo} alt="Google" className="h-6 w-6" />
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 py-6 text-base font-semibold"
          onClick={signInWithApple}
        >
          <img
            src={appleLogo}
            alt="Apple"
            className="h-6 w-6"
            style={{ filter: isDarkMode ? "brightness(1.5)" : "none" }}
          />
          Sign in with Apple
        </Button>
      </CardContent>
    </Card>
  );
}
