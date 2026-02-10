import { useAuthStore } from '../context/authStore';

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
        <div className="card p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <p className="text-lg">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <p className="text-lg">{user?.phone}</p>
            </div>
            {user?.email && (
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Puntos de Lealtad</label>
              <p className="text-lg text-parmesana-green font-bold">{user?.loyaltyPoints || 0} puntos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
