import { useState } from 'react';
import { Plus, Search, Phone, Mail, MoreVertical } from 'lucide-react';

interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  objectifs: string[];
  derniereSeance: string;
}

function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const clients: Client[] = [
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      objectifs: ['Perte de poids', 'Tonification'],
      derniereSeance: '2026-02-20',
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@email.com',
      telephone: '06 23 45 67 89',
      objectifs: ['Prise de masse', 'Force'],
      derniereSeance: '2026-02-22',
    },
    {
      id: '3',
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@email.com',
      telephone: '06 34 56 78 90',
      objectifs: ['Flexibilité', 'Bien-être'],
      derniereSeance: '2026-02-24',
    },
  ];

  const filteredClients = clients.filter(client =>
    `${client.prenom} ${client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-600">Gère ton portefeuille clients</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus size={20} />
          Nouveau client
        </button>
      </header>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Clients list */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-sm font-medium text-gray-600">
          <div className="col-span-3">Client</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-4">Objectifs</div>
          <div className="col-span-2">Dernière séance</div>
        </div>

        {filteredClients.map((client) => (
          <div key={client.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="col-span-3">
              <p className="font-medium text-gray-800">{client.prenom} {client.nom}</p>
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Mail size={14} />
                {client.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                {client.telephone}
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex flex-wrap gap-2">
                {client.objectifs.map((obj, idx) => (
                  <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">{client.derniereSeance}</span>
              <button className="p-2 hover:bg-gray-200 rounded-lg">
                <MoreVertical size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;
