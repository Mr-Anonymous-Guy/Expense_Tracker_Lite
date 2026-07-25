import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const getToken = () => useAuthStore.getState().token || "";

const mockData = {
  income: [],
  subscriptions: [],
  profiles: [],
  transactions: []
};

// This is a proxy that mimics the Supabase client but maps directly to FinSmart's native backend.
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: useAuthStore.getState().user }, error: null }),
    signOut: async () => { useAuthStore.getState().logout(); },
    onAuthStateChange: (cb: any) => {
       const unsub = useAuthStore.subscribe((state, prevState) => {
         if (state.isAuthenticated && !prevState.isAuthenticated) cb("SIGNED_IN", { user: state.user });
         if (!state.isAuthenticated && prevState.isAuthenticated) cb("SIGNED_OUT", null);
       });
       return { data: { subscription: { unsubscribe: unsub } } };
    },
    updateUser: async (args?: any) => ({ error: null as { message: string } | null }),
    resetPasswordForEmail: async (email: string) => ({ error: null as { message: string } | null }),
  },
  from: (table: string) => {
    return {
      select: (fields: string) => {
        let orderField: string | null = null;
        let ascending = true;
        let gteVal: any = null;
        let eqVal: any = null;
        let maybeSingle = false;

        const execute = async () => {
          try {
            const token = getToken();
            let data: any[] = [];
            if (table === "expenses") data = (await api.expenses(token)).expenses || [];
            else if (table === "budgets") data = (await api.budgets(token)).budgets || [];
            else if (table === "investments") data = (await api.investments(token)).investments || [];
            else if (table === "goals") data = (await api.goals(token)).goals || [];
            else if (table === "reports") data = (await api.reports(token)).reports || [];
            else data = (mockData as any)[table] || [];

            if (orderField) {
              data = data.sort((a, b) => {
                const aVal = a[orderField!];
                const bVal = b[orderField!];
                if (aVal < bVal) return ascending ? -1 : 1;
                if (aVal > bVal) return ascending ? 1 : -1;
                return 0;
              });
            }
            if (gteVal) {
              data = data.filter(item => new Date(item[gteVal.field]) >= new Date(gteVal.value));
            }
            if (eqVal) {
              data = data.filter(item => item[eqVal.field] === eqVal.value);
            }
            
            if (maybeSingle) {
               return { data: data[0] || null, error: null };
            }

            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        };

        const chain = {
          order: (field: string, opts?: { ascending?: boolean }) => {
            orderField = field;
            if (opts?.ascending !== undefined) ascending = opts.ascending;
            return chain as any;
          },
          gte: (field: string, value: any) => {
            gteVal = { field, value };
            return chain as any;
          },
          eq: (field: string, value: any) => {
            eqVal = { field, value };
            return chain as any;
          },
          maybeSingle: () => {
            maybeSingle = true;
            return chain as any;
          },
          then: (resolve: any, reject?: any) => execute().then(resolve, reject),
          catch: (reject: any) => execute().catch(reject),
          finally: (cb: any) => execute().finally(cb)
        };
        return chain as unknown as Promise<{ data: any; error: any }> & {
          order: any; gte: any; eq: any; maybeSingle: any;
        };
      },
      insert: (payload: any) => {
        const execute = async () => {
          try {
            const token = getToken();
            if (table === "expenses") await api.createExpense(token, payload);
            else if (table === "investments") await api.createInvestment(token, payload);
            else if (table === "goals") await api.createGoal(token, payload);
            else if (table === "budgets") await api.upsertBudget(token, payload);
            return { error: null };
          } catch (e: any) {
             return { error: e };
          }
        };
        return { 
          then: (res: any, rej?: any) => execute().then(res, rej),
          catch: (rej: any) => execute().catch(rej),
          finally: (cb: any) => execute().finally(cb)
        } as unknown as Promise<{ error: any }>;
      },
      upsert: (payload: any) => {
        const execute = async () => {
          try {
             const token = getToken();
             if (table === "budgets") await api.upsertBudget(token, payload);
             return { error: null };
          } catch (e: any) {
             return { error: e };
          }
        };
        return { 
          then: (res: any, rej?: any) => execute().then(res, rej),
          catch: (rej: any) => execute().catch(rej),
          finally: (cb: any) => execute().finally(cb)
        } as unknown as Promise<{ error: any }>;
      },
      update: (payload: any) => {
        let eqVal: any = null;
        const execute = async () => {
          return { error: null };
        };
        const chain = {
          eq: (field: string, val: any) => { eqVal = { field, val }; return chain as any; },
          then: (res: any, rej?: any) => execute().then(res, rej),
          catch: (rej: any) => execute().catch(rej),
          finally: (cb: any) => execute().finally(cb)
        };
        return chain as unknown as Promise<{ error: any }> & { eq: any };
      },
      delete: () => {
         let eqVal: any = null;
         const execute = async () => {
           try {
             const token = getToken();
             if (table === "expenses") await api.deleteExpense(token, eqVal.val);
             return { error: null };
           } catch (e: any) {
             return { error: e };
           }
         };
         const chain = {
           eq: (field: string, val: any) => { eqVal = { field, val }; return chain as any; },
           then: (res: any, rej?: any) => execute().then(res, rej),
           catch: (rej: any) => execute().catch(rej),
           finally: (cb: any) => execute().finally(cb)
         };
         return chain as unknown as Promise<{ error: any }> & { eq: any };
      }
    };
  }
};
