import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terminos y Condiciones",
  description: "Terminos y condiciones de uso de DocuSafe",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <article className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Terminos y Condiciones de Uso</h1>
          <p className="text-sm text-slate-500 mt-2">Ultima actualizacion: 21 de mayo de 2026</p>
          <p className="text-sm text-slate-600 mt-4">
            Estos terminos regulan el acceso y uso de la plataforma DocuSafe. Al registrarte o usar el servicio,
            aceptas estos terminos y nuestra forma de tratamiento de datos.
          </p>
        </header>

        <section className="space-y-6 text-slate-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Identificacion del servicio</h2>
            <p>
              DocuSafe es una plataforma digital para carga, organizacion y consulta de documentos digitales.
              El servicio esta dirigido a usuarios en Republica Dominicana y puede ser utilizado por usuarios de otros paises,
              sujeto a legislacion aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Aceptacion y capacidad legal</h2>
            <p>
              Al usar DocuSafe declaras que tienes capacidad legal para contratar y aceptar estos terminos.
              Si representas a una empresa, declaras que tienes autorizacion para obligarla legalmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Cuenta y autenticacion</h2>
            <p>
              El acceso se realiza mediante autenticacion con Google. Eres responsable de mantener la seguridad de tu cuenta,
              tus credenciales y cualquier actividad realizada desde ella.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Uso permitido y prohibiciones</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Usar la plataforma solo para fines licitos y autorizados.</li>
              <li>No cargar contenido ilegal, fraudulento, difamatorio o que viole derechos de terceros.</li>
              <li>No intentar acceder sin autorizacion a sistemas, datos o cuentas de otros usuarios.</li>
              <li>No introducir malware, scripts maliciosos o actividades de denegacion de servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Propiedad y responsabilidad sobre documentos</h2>
            <p>
              Conservas la titularidad de los documentos que cargues. Garantizas que tienes derechos suficientes para almacenarlos
              y tratarlos en la plataforma. DocuSafe no adquiere propiedad sobre tu contenido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5.1 Propiedad de la plataforma</h2>
            <p>
              DocuSafe, incluyendo su marca, diseno, codigo fuente, interfaces, logos y demas activos de propiedad intelectual,
              es propiedad de Kolectiv. Queda prohibido copiar, modificar, distribuir o explotar estos elementos sin autorizacion previa y escrita.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Privacidad y proteccion de datos</h2>
            <p>
              El tratamiento de datos personales se realiza conforme a principios de licitud, finalidad, proporcionalidad y seguridad.
              En Republica Dominicana se observa, entre otras normas aplicables, la Ley No. 172-13 sobre proteccion de datos de caracter personal.
            </p>
            <p>
              Para usuarios en otras jurisdicciones, DocuSafe procura alinearse a estandares internacionales de privacidad,
              incluyendo principios del Reglamento General de Proteccion de Datos (RGPD/GDPR) cuando resulte aplicable,
              y mecanismos adecuados para transferencias internacionales de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Seguridad de la informacion</h2>
            <p>
              DocuSafe aplica medidas tecnicas y organizativas razonables para proteger la confidencialidad, integridad y disponibilidad de la informacion.
              No obstante, ningun sistema es 100% invulnerable, por lo que no se garantiza seguridad absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Disponibilidad del servicio</h2>
            <p>
              El servicio puede verse afectado por mantenimiento, actualizaciones, fallas tecnicas o eventos fuera de control razonable.
              DocuSafe puede modificar, suspender o interrumpir funcionalidades cuando sea necesario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Limitacion de responsabilidad</h2>
            <p>
              En la medida permitida por la ley, DocuSafe no sera responsable por danos indirectos, incidentales, especiales,
              lucro cesante o perdida de datos derivados del uso o imposibilidad de uso del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Cumplimiento normativo de referencia</h2>
            <p>
              Sin limitar otras normas aplicables, el uso del servicio se orienta por marcos regulatorios relevantes,
              incluyendo en Republica Dominicana la Ley 172-13 (proteccion de datos), Ley 53-07 (crimenes y delitos de alta tecnologia),
              Ley 126-02 (comercio electronico, documentos y firmas digitales) y normas de proteccion al consumidor cuando correspondan.
            </p>
            <p>
              A nivel internacional, se consideran estandares y obligaciones aplicables segun la jurisdiccion del usuario,
              incluyendo GDPR y otras normativas de privacidad y seguridad de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">11. Cambios a estos terminos</h2>
            <p>
              DocuSafe puede actualizar estos terminos en cualquier momento. La version vigente se publicara en esta pagina
              con su fecha de actualizacion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">12. Contacto</h2>
            <p>
              Para consultas legales o de privacidad puedes comunicarte con el responsable del servicio por los canales de soporte habilitados.
            </p>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              Aviso: este documento es una base general informativa y no constituye asesoria legal individualizada.
              Para cumplimiento estricto en sectores regulados, se recomienda revision por un profesional del derecho.
            </p>
          </section>
        </section>

        <footer className="mt-8 pt-6 border-t border-slate-200">
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Volver al inicio de sesion
          </Link>
        </footer>
      </article>
    </main>
  );
}
