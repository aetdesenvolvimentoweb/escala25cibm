import Loading from "@/components/layout/loading";
import MainLayout from "@/components/layout/main";
import { IGraduationDTO } from "@/dtos/IGraduationDTO";
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

const Graduations = () => {
  const [id, setId] = useState<string>("");
  const [order, setOrder] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [graduations, setGraduations] = useState<IGraduationDTO[]>(
    [] as IGraduationDTO[]
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const data = await fetch("/api/graduations/listAll", {
        method: "GET",
      }).then(async (res) => res.json());

      setLoading(false);
      setGraduations(data.graduations);
    };

    loadData();
  }, []);

  const handleCancel = () => {
    setId("");
    setOrder(0);
    setName("");
    setPage(1);
    setAdding(false);
    setEditing(false);
    setDeleting(false);
  };

  const handleEdit = (graduation: IGraduationDTO) => {
    setEditing(true);
    setId(graduation.id);
    setOrder(graduation.order);
    setName(graduation.name);
  };

  const handleDeleting = (id: string) => {
    setId(id);
    setDeleting(true);
  };

  const handleChangePage = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseInt(event.target.value))) {
      setPage(1);
    } else {
      setPage(parseInt(event.target.value));
    }
  };

  const handleDeleteGraduation = async () => {
    setLoading(true);

    const response = await fetch(`/api/graduations/${id}/delete`, {
      method: "DELETE",
    }).then(async (res) => await res.json());

    setLoading(false);

    if (response.success) {
      toast.success("Graduação deletada com sucesso.");
      setGraduations(
        graduations
          .filter((v) => v.id !== id)
          .sort((a, b) => a["order"] - b["order"])
      );
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
    }

    if (editing && !id) {
      toast.error("Identificador da graduação não foi encontrado.");
    }
    setLoading(true);

    if (adding) {
      const response = await fetch("/api/graduations/create", {
        method: "POST",
        body: JSON.stringify({ name }),
      }).then(async (res) => await res.json());

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Graduação cadastrada com sucesso.");

        setGraduations(
          [...graduations, response.graduation].sort(
            (a, b) => a["order"] - b["order"]
          )
        );
        handleCancel();
      }
    }

    if (editing) {
      const response = await fetch(`/api/graduations/${id}/update`, {
        method: "PUT",
        body: JSON.stringify({ order, name }),
      }).then(async (res) => await res.json());

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Graduação atualizada com sucesso.");
        const graduationUpdated = graduations.map((g) => {
          if (g.id === id) {
            return { id, order, name };
          }
          return g;
        });

        setGraduations(
          graduationUpdated.sort((a, b) => a["order"] - b["order"])
        );
        handleCancel();
      }
    }

    setLoading(false);
  };

  return (
    <MainLayout title="Graduações">
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
            Novo
          </button>
          <div className="flex items-center p-1 border border-gray-800 rounded-md">
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
          </div>
        </div>
      </div>

      <div
        className={`${deleting ? "flex" : "hidden"} flex-col items-center mt-2`}
      >
        <div className="mb-1">
          <strong>Deseja realmente deletar a graduação?</strong>
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
            onClick={handleDeleteGraduation}
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
          {editing && (
            <div className="flex items-center mb-6">
              <div className="pr-1">
                <label htmlFor="order">Ordem:</label>
              </div>
              <div className="flex-1">
                <input
                  className="w-full p-1 border border-gray-800 rounded-md focus:outline-none"
                  type="number"
                  id="order"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setOrder(parseInt(event.target.value))
                  }
                  value={order ? order : undefined}
                />
              </div>
            </div>
          )}
          <div className="flex items-center mb-6">
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

          <div className="flex items-center">
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
            <div className="w-1/6 px-2 py-1 text-center border-r border-r-transparent">
              #
            </div>
            <div className="w-3/6 px-2 py-1 text-center border-r border-r-transparent">
              Graduação
            </div>
            <div className="w-2/6 px-2 py-1"></div>
          </div>
        </div>
        <div
          id="corpo"
          className="border-l border-r border-gray-800 rounded-b-md"
        >
          {graduations.length > 0 ? (
            graduations.map((g) => (
              <div
                key={g.id}
                className="flex border-b border-gray-800 last:rounded-b-md"
              >
                <div className="w-1/6 px-2 py-1 text-center border-r border-r-gray-800">
                  {g.order}
                </div>
                <div className="w-3/6 px-2 py-1 border-r border-r-gray-800">
                  {g.name}
                </div>
                <div className="flex items-center justify-center w-2/6 px-2 py-1">
                  <button className="pr-1" onClick={() => handleEdit(g)}>
                    <FiEdit2 size={20} />
                  </button>
                  <button onClick={() => handleDeleting(g.id)}>
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

      <div
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
      </div>
    </MainLayout>
  );
};

export default Graduations;
