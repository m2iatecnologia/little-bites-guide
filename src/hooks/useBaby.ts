import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBaby() {
  const { user } = useAuth();
  const [baby, setBaby] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("babies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setBaby(data);
        setLoading(false);
      });
  }, [user]);

  return { baby, loading, hasBaby: !!baby };
}
