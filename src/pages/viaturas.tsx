import Loading from "@/components/layout/loading";
import MainLayout from "@/components/layout/main";
import { IVehicleDTO } from "@/dtos/IVehicleDTO";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit2,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Vehicles = () => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [vehicles, setVehicles] = useState<IVehicleDTO[]>([] as IVehicleDTO[]);
  const [loading, setLoading] = useState<boolean>(false);
  /* const [searched, setSearched] = useState<string>("");
  const [page, setPage] = useState<number>(1); */
  const [adding, setAdding] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const data = await fetch("/api/vehicles/listAll", { method: "GET" }).then(
        async (res) => await res.json()
      );

      setLoading(false);
      setVehicles(data.vehicles);
    };

    loadData();
  }, []);

  const handleCancel = () => {
    setId("");
    setName("");
    setStatus("");
    /* setPage(1); */
    setAdding(false);
    setEditing(false);
    setDeleting(false);
  };

  const handleEdit = (vehicle: IVehicleDTO) => {
    setEditing(true);
    setId(vehicle.id);
    setName(vehicle.name);
    setStatus(vehicle.status);
  };

  const handleDeleting = (id: string) => {
    setId(id);
    setDeleting(true);
  };

  /* const handleChangePage = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseInt(event.target.value))) {
      setPage(1);
    } else {
      setPage(parseInt(event.target.value));
    }
  }; */

  const handleDeleteVehicle = async () => {
    setLoading(true);

    const response = await fetch(`/api/vehicles/${id}/delete`, {
      method: "DELETE",
    }).then(async (res) => await res.json());

    setLoading(false);

    if (response.success) {
      toast.success("Viatura deletada com sucesso.");
      setVehicles(vehicles.filter((v) => v.id !== id));
      handleCancel();
    } else {
      toast.error(response.error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name) {
      toast.error("Campo Nome precisa ser preenchido.");
      document.getElementById("name")?.focus();
      return;
    }

    if (!status) {
      toast.error("Campo Situação precisa ser preenchido.");
      document.getElementById("status")?.focus();
      return;
    }

    if (editing && !id) {
      toast.error("Identificador da viatura não encontrado.");
      return;
    }

    setLoading(true);

    if (adding) {
      const response = await fetch("/api/vehicles/create", {
        method: "POST",
        body: JSON.stringify({ name, status }),
      }).then(async (res) => await res.json());

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Viatura cadastrada com sucesso.");
        setVehicles([...vehicles, response.vehicle]);
        handleCancel();
      }
    }

    if (editing) {
      const response = await fetch(`/api/vehicles/${id}/update`, {
        method: "PUT",
        body: JSON.stringify({ name, status }),
      }).then(async (res) => await res.json());

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Viatura atualizada com sucesso.");
        const vehiclesUpdated = vehicles.map((v) => {
          if (v.id === id) {
            return { id, name, status };
          }
          return v;
        });
        setVehicles(vehiclesUpdated);
        handleCancel();
      }
    }

    setLoading(false);
  };

  return (
    <MainLayout title="Viaturas">
      {loading && <Loading />}
      <div>
        <div
          className={`${
            adding || editing || deleting ? "hidden" : "flex"
          } items-center justify-between`}
        >
          <button
            className="px-4 py-1 font-bold text-white bg-green-600 rounded-md"
            onClick={() => setAdding(true)}
          >
            Nova
          </button>
          {/* <div className="flex items-center p-1 border border-gray-800 rounded-md">
            <input
              className="w-40 px-2 focus:outline-none"
              type="text"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearched(event.target.value)
              }
              value={searched}
            />
            <div className={`${searched ? "visible" : "invisible"} flex`}>
              <button className="text-red-600" onClick={() => setSearched("")}>
                <FiXCircle size={20} />
              </button>
            </div>
          </div> */}
        </div>
      </div>

      <div
        className={`${deleting ? "flex" : "hidden"} flex-col items-center mt-2`}
      >
        <div className="mb-1">
          <strong>Deseja realmente deletar a viatura?</strong>
        </div>
        <div>
          <button
            className="px-4 py-1 mr-1 font-bold text-white bg-green-600 rounded-md"
            onClick={handleCancel}
          >
            Não
          </button>
          <button
            className="px-4 py-1 ml-1 font-bold text-white bg-red-600 rounded-md"
            onClick={handleDeleteVehicle}
          >
            Sim
          </button>
        </div>
      </div>

      <div
        className={`${
          adding || editing ? "flex" : "hidden"
        } items-center justify-between mt-2`}
      >
        <form
          className="w-full p-2 text-sm border border-gray-800 rounded-md"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <h2 className="font-bold">Cadastrar Viatura</h2>
          </div>

          <div className="flex items-center mt-4">
            <div className="pr-1">
              <label htmlFor="name">Nome:</label>
            </div>
            <div className="flex-1">
              <input
                className="w-full p-1 border border-gray-800 rounded-md focus:outline-none"
                type="text"
                id="name"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setName(event.target.value)
                }
                value={name}
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="pr-1">
              <label htmlFor="status">Situação:</label>
            </div>
            <div className="flex-1">
              <select
                id="status"
                className="w-full p-1 bg-white border border-gray-800 rounded-md focus:outline-none"
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setStatus(event.target.value)
                }
                value={status}
              >
                <option value="">Selecione</option>
                <option value="Ativa">Ativa</option>
                <option value="Baixada">Baixada</option>
              </select>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <button
              className="w-1/2 px-6 py-2 mr-1 font-bold text-white bg-red-600 border border-gray-800 rounded-md mr1"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="w-1/2 px-6 py-2 font-bold text-white bg-green-600 border border-gray-800 rounded-md"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>

      <div
        id="table"
        className={`${
          adding || editing || deleting ? "hidden" : "flex"
        } flex-col mt-2 rounded-t-md`}
      >
        <div
          id="cabecalho"
          className="text-white bg-red-800 border border-gray-800 rounded-t-md"
        >
          <div id="linha" className="flex font-bold uppercase">
            <div className="w-1/3 px-2 py-1 text-center border-r border-r-transparent">
              Viatura
            </div>
            <div className="w-1/3 px-2 py-1 text-center border-r border-r-transparent">
              Situação
            </div>
            <div className="w-1/3 px-2 py-1"></div>
          </div>
        </div>
        <div
          id="corpo"
          className="border-l border-r border-gray-800 rounded-b-md"
        >
          {vehicles.length > 0 ? (
            vehicles.map((v) => (
              <div
                key={v.id}
                className="flex border-b border-gray-800 last:rounded-b-md"
              >
                <div className="w-1/3 px-2 py-1 border-r border-r-gray-800">
                  {v.name}
                </div>
                <div className="w-1/3 px-2 py-1 border-r border-r-gray-800">
                  {v.status}
                </div>
                <div className="flex items-center justify-center w-1/3 px-2 py-1">
                  <button
                    className="pr-1"
                    title="editar viatura"
                    aria-label="editar viatura"
                    onClick={() => handleEdit(v)}
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button onClick={() => handleDeleting(v.id)}>
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex border-b border-gray-800 last:rounded-b-md">
              <div className="w-full px-2 py-1 text-center">
                Nenhum resultado foi encontrado
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <div
        id="paginacao"
        className={`${
          adding || editing || deleting ? "hidden" : "flex"
        } items-center justify-center mt-2`}
      >
        <button>
          <FiChevronsLeft size={20} />
        </button>
        <button className="px-2">
          <FiChevronLeft size={20} />
        </button>
        <input
          className="w-10 text-center border border-gray-800 rounded-md focus:outline-none"
          type="text"
          onChange={handleChangePage}
          value={page.toString()}
        />
        <span className="pl-2">de</span>
        <span className="pl-2">3</span>
        <button className="pl-2">
          <FiChevronRight size={20} />
        </button>
        <button className="pl-2">
          <FiChevronsRight size={20} />
        </button>
      </div> */}
    </MainLayout>
  );
};

export default Vehicles;
