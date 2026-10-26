import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersApi, premmisionApi } from "../service/usersApi";


type User = {
    id: number;
    familyId: number;
    username: string;
    displayName: string;
    role: 'Admin' | 'User';
    canUpdateQuantity: boolean;
    canAddToShoppingList: boolean;
    canMarkPurchased: boolean;
};
const Permissions = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: getUsersApi
    });
    const updatePermission = useMutation({
        mutationFn: ({ id, name, value }: { id: number; name: string; value: boolean }) =>
            premmisionApi(id, name, value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    if (isLoading) {
        return <p>טוען משתמשים...</p>;
    }

    if (error) {
        return <p>אירעה שגיאה בטעינת המשתמשים</p>;
    }
    return <>
        <h1>משתמשים והרשאות</h1>
        <h4>קובעים מה כל בן בית רשאי לעשות. השינוי נכנס לתוקף מיד</h4>
        <table>

            <thead>
                <tr>
                    <th>בן בית</th>
                    <th>עדכון כמות של מוצר במלאי</th>
                    <th>הוספה לרשימת קניות</th>
                    <th>סימון כנרכש</th>
                </tr>
            </thead>
            <tbody>
                {
                    data?.map(users => (
                        <tr key={users.id}>
                            <td>{users.displayName}</td>
                            <td><input
                                className="toggle"
                                type="checkbox"
                                checked={users.canUpdateQuantity}
                                onChange={(e) => {
                                    updatePermission.mutate({ id: users.id, name: "canUpdateQuantity", value: e.target.checked })
                                }}
                            /></td>
                            <td><input
                                className="toggle"
                                type="checkbox"
                                checked={users.canAddToShoppingList}
                                onChange={(e) => {
                                    updatePermission.mutate({ id: users.id, name: "canAddToShoppingList", value: e.target.checked })
                                }}
                            /></td>
                            <td><input
                                className="toggle"
                                type="checkbox"
                                checked={users.canMarkPurchased}
                                onChange={(e) => {
                                    updatePermission.mutate({ id: users.id, name: "canMarkPurchased", value: e.target.checked })
                                }}
                            /></td>

                        </tr>
                    ))
                }
            </tbody>
        </table>
    </>
}
export default Permissions