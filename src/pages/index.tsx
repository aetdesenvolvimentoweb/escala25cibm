import Loading from "@/components/layout/loading";
import MainLayout from "@/components/layout/main";
import { IForceMapDTO } from "@/dtos/IForceMapDTO";
import { IGarrisonDTO, IMilitaryInGarrisonDTO } from "@/dtos/IGarrisonDTO";
import { IMilitaryDTO } from "@/dtos/IMilitaryDTO";
import { IServiceExchangeDTO } from "@/dtos/IServiceExchange";
import { IVehicleDTO } from "@/dtos/IVehicleDTO";
import { addDays } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiFile, FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";

const Home = () => {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<IVehicleDTO[]>([] as IVehicleDTO[]);
  const [forceMap, setForceMap] = useState<IForceMapDTO | null>(null);
  const [initialService, setInitialService] = useState<Date>();
  const [finalService, setFinalService] = useState<Date>();
  const [standbyOfficer, setStandbyOfficer] = useState<IMilitaryDTO>(
    {} as IMilitaryDTO
  );
  const [adjunct, setAdjunct] = useState<IMilitaryDTO>({} as IMilitaryDTO);
  const [garrisons, setGarrisons] = useState<IGarrisonDTO[]>(
    [] as IGarrisonDTO[]
  );
  const [serviceExchanges, setServiceExchanges] = useState<
    IServiceExchangeDTO[]
  >([] as IServiceExchangeDTO[]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const responseForceMaps = await fetch("/api/forceMap/listAll", {
        method: "GET",
      }).then(async (res) => await res.json());

      const responseVehicles = await fetch("/api/vehicles/listAll", {
        method: "GET",
      }).then(async (res) => await res.json());

      setLoading(false);

      if (responseForceMaps.forceMap) {
        setForceMap(responseForceMaps.forceMap[0]);
      }

      if (responseVehicles.vehicles) {
        setVehicles(responseVehicles.vehicles);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (forceMap) {
      setInitialService(new Date(forceMap.initialOfService));
      setFinalService(addDays(new Date(forceMap.initialOfService), 1));

      if (forceMap.standbyOfficer) {
        setStandbyOfficer(forceMap.standbyOfficer);
      }
      if (forceMap.adjunct) {
        setAdjunct(forceMap.adjunct);
      }
      if (forceMap.garrisons) {
        setGarrisons(forceMap.garrisons);
      }
      if (forceMap.serviceExchanges) {
        setServiceExchanges(forceMap.serviceExchanges);
      }
    }
  }, [forceMap]);

  const handleNewForceMap = async () => {
    setLoading(true);

    const response = await fetch("/api/forceMap/deleteAll", {
      method: "GET",
    }).then(async (res) => await res.json());

    setLoading(false);

    if (response.success) {
      router.push("/mapa/cadastrar");
    } else {
      toast.error("Erro na conexão com o servidor.");
    }
  };

  return (
    <MainLayout title="Página Inicial">
      {loading && <Loading />}
      <div>
        <div className={"flex items-center gap-2"}>
          <button
            className="px-4 py-1 font-bold text-white bg-green-600 rounded-md"
            aria-label="cadastrar novo resumo"
            title="cadastrar novo resumo"
            onClick={handleNewForceMap}
          >
            Novo Resumo
          </button>
          <Link
            className="px-4 py-1 font-bold text-white bg-green-600 rounded-md"
            aria-label="efetivo da unidade"
            title="efetivo da unidade"
            href={"/efetivo"}
            passHref
          >
            Efetivo
          </Link>
          <Link
            className="px-4 py-1 font-bold text-white bg-green-600 rounded-md"
            aria-label="situação de viaturas"
            title="situação de viaturas"
            href={"/viaturas"}
            passHref
          >
            Viaturas
          </Link>
        </div>
      </div>

      {/* início do resumo */}
      {forceMap && (
        <div>
          <div className="mt-3">
            <h2 className="font-bold uppercase">
              {`Serviço de ${initialService?.toLocaleDateString()} para ${finalService?.toLocaleDateString()}`}
            </h2>
          </div>

          <div className="mt-2">
            <span className="pr-1 mt-2 font-bold">Oficial de Sobreaviso:</span>
            <span>{`${standbyOfficer?.graduation?.name} ${standbyOfficer?.rg} ${standbyOfficer?.name}`}</span>
          </div>

          <div className="mt-1">
            <span className="pr-1 font-bold">Adjunto:</span>
            <span>{`${adjunct?.graduation?.name} ${adjunct?.rg} ${adjunct?.name}`}</span>
          </div>

          <div className="mt-1">
            <span className="font-bold">Viaturas Ativas:</span>
            <div className="flex p-2 mb-2 border border-gray-800 rounded-md">
              <p className="text-justify">
                {vehicles &&
                  vehicles
                    .filter((v) => v.status === "Ativa")
                    .map((v, index) => {
                      if (v.status === "Ativa") {
                        return `${index === 0 ? "" : ", "}${v.name}`;
                      }
                    })}
              </p>
            </div>
          </div>

          <div className="mt-1">
            <span className="font-bold">Viaturas Baixadas:</span>
            <div className="p-2 mb-2 border border-gray-800 rounded-md">
              <p className="text-justify">
                {vehicles &&
                  vehicles
                    .filter((v) => v.status === "Baixada")
                    .map((v, index) => {
                      return `${index === 0 ? "" : ", "} ${v.name}`;
                    })}
              </p>
            </div>
          </div>

          <div className="mt-1">
            <span className="font-bold">Guarnições:</span>
            {garrisons &&
              garrisons.map((g) => (
                <div
                  key={g.id}
                  className="p-2 mb-2 border border-gray-800 rounded-md"
                >
                  <span className="block font-bold">{g.vehicle?.name}</span>
                  {g.militaryInGarrison &&
                    g.militaryInGarrison?.map((m: IMilitaryInGarrisonDTO) => (
                      <div key={m.id}>
                        <span className="pl-2 pr-1">{`${m.military?.graduation?.name} ${m.military?.rg} ${m.military?.name}`}</span>
                        <strong className="text-red-700">{`${
                          m.scaleType !== "Ordinaria" ? `(${m.scaleType})` : ""
                        }`}</strong>
                      </div>
                    ))}
                </div>
              ))}
          </div>

          {serviceExchanges && serviceExchanges.length > 0 && (
            <div className="mt-1">
              <span className="font-bold">Trocas de Serviço:</span>
              {serviceExchanges &&
                serviceExchanges.map((se) => (
                  <div
                    key={se.id}
                    className="flex flex-col p-1 mb-2 border border-gray-800 rounded-md"
                  >
                    <div>
                      <span className="pr-1 font-bold">Substituído:</span>
                      <span>{`${se.replaced?.graduation?.name} ${se.replaced?.rg} ${se.replaced?.name}`}</span>
                    </div>
                    <div>
                      <span className="pr-1 font-bold">Substituto:</span>
                      <span>{`${se.substitute?.graduation?.name} ${se.substitute?.rg} ${se.substitute?.name}`}</span>
                    </div>
                    <div>
                      <span className="pr-1 font-bold">Início:</span>
                      <span>{new Date(se.initial).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="pr-1 font-bold">Final:</span>
                      <span>{new Date(se.final).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      {/* final do resumo */}
    </MainLayout>
  );
};

export default Home;
