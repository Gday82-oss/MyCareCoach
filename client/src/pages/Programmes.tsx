import { useState } from 'react';
import { Plus, Dumbbell, Clock, Users } from 'lucide-react';

interface Programme {
  id: string;
  nom: string;
  description: string;
  duree: number;
  seancesParSemaine: number;
  exercices: number;
  clients: number;
}

function Programmes() {
  const [programmes] = useState<Programme[]>([
    {
      id: '1',
      nom: 'Débutant Force',
      description: 'Programme d\'introduction à la musculation',
      duree: 8,
      seancesParSemaine: 3,
      exercices: 6,
      clients: 5,
    },
    {
      id: '2',
      nom: 'Perte de Poids',
      description: 'Cardio + renforcement pour brûler les graisses',
      duree: 12,
      seancesParSemaine: 4,
      exercices: 8,
      clients: 8,
    },
    {
      id: '3',
      nom: 'Prise de Masse',
      description: 'Hypertrophie musculaire avancée',
      duree: 16,
      seancesParSemaine: 5,
      exercices: 10,
      clients: 3,
    },
  ]);

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Programmes</h1>
          <p className="text-gray-600">Crée et gère tes programmes d'entraînement</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus size={20} />
          Nouveau programme
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Dumbbell className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{programmes.length}</p>
              <p className="text-gray-600">Programmes actifs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">36</p>
              <p className="text-gray-600">Exercices disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">16</p>
              <p className="text-gray-600">Clients actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des programmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((programme) => (
          <div key={programme.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Dumbbell className="text-emerald-600" size={24} />
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                {programme.clients} clients
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{programme.nom}</h3>
            <p className="text-gray-600 mb-4">{programme.description}</p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{programme.duree} semaines · {programme.seancesParSemaine}x/semaine</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell size={16} />
                <span>{programme.exercices} exercices</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Voir
              </button>
              <button className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Modifier
              </button>
            </div>
          </div>
        ))}

        {/* Ajouter nouveau */}
        <button className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-emerald-300 hover:text-emerald-600 transition-colors min-h-[280px]">
          <Plus size={48} className="mb-4" />
          <span className="text-lg font-medium">Créer un programme</span>
        </button>
      </div>
    </div>
  );
}

export default Programmes;