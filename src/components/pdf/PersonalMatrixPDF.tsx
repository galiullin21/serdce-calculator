import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { PersonalMatrix } from "@/lib/calculations";
import { PDFCoverPage } from "./PDFCoverPage";
import { PDFContentPage } from "./PDFContentPage";
import { PDFSection } from "./PDFSection";
import { positionDescriptions, lifePeriods, getArcanaName, arcanaDatabase } from "@/lib/arcana";

interface PersonalMatrixPDFProps {
  matrix: PersonalMatrix;
  name: string;
}

export const PersonalMatrixPDF = forwardRef<HTMLDivElement, PersonalMatrixPDFProps>(
  ({ matrix, name }, ref) => {
    const { t } = useTranslation();

    const formatBirthDate = () => {
      const { day, month, year } = matrix.birthDate;
      return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    };

    const getArcanaDescription = (arcanaNum: number): string => {
      const arcana = arcanaDatabase.find(a => a.number === arcanaNum);
      return arcana?.personalDescription || '';
    };

    return (
      <div ref={ref} className="absolute left-[-9999px] top-0">
        {/* Страница 1: Обложка */}
        <div data-pdf-page="1">
          <PDFCoverPage
            title={t("pdf.matrixTitle")}
            subtitle={t("pdf.matrixSubtitle")}
            birthDate={formatBirthDate()}
            name={name}
          />
        </div>

        {/* Страница 2: Основной треугольник */}
        <div data-pdf-page="2">
          <PDFContentPage title={t("results.mainTriangle")} pageNumber={2}>
            {[1, 2, 3, 4, 5, 6].map((pos) => {
              const arcana = matrix.positions[pos - 1];
              const posDesc = positionDescriptions[pos];
              return (
                <PDFSection
                  key={pos}
                  title={`${posDesc?.title || `Позиция ${pos}`} — Аркан ${arcana} (${getArcanaName(arcana)})`}
                >
                  {posDesc?.description}
                  {"\n\n"}
                  {getArcanaDescription(arcana)}
                </PDFSection>
              );
            })}
          </PDFContentPage>
        </div>

        {/* Страница 3: Цели жизни */}
        <div data-pdf-page="3">
          <PDFContentPage title={t("results.lifeGoals")} pageNumber={3}>
            {[7, 8, 9].map((pos) => {
              const arcana = matrix.positions[pos - 1];
              const posDesc = positionDescriptions[pos];
              return (
                <PDFSection
                  key={pos}
                  title={`${posDesc?.title || `Позиция ${pos}`} — Аркан ${arcana} (${getArcanaName(arcana)})`}
                >
                  {posDesc?.description}
                  {"\n\n"}
                  {getArcanaDescription(arcana)}
                </PDFSection>
              );
            })}
          </PDFContentPage>
        </div>

        {/* Страница 4: Периоды жизни */}
        <div data-pdf-page="4">
          <PDFContentPage title={t("results.lifePeriods")} pageNumber={4}>
            {lifePeriods.map((period, index) => (
              <PDFSection key={index} title={period.title}>
                {period.description}
                {"\n\n"}
                <strong>Арканы периода:</strong>{" "}
                {period.positions.map(pos => `${matrix.positions[pos - 1]} (${getArcanaName(matrix.positions[pos - 1])})`).join(", ")}
              </PDFSection>
            ))}
          </PDFContentPage>
        </div>

        {/* Страница 5: Карма */}
        <div data-pdf-page="5">
          <PDFContentPage title={t("results.karma")} pageNumber={5}>
            {[10, 11, 12].map((pos) => {
              const arcana = matrix.positions[pos - 1];
              const posDesc = positionDescriptions[pos];
              return (
                <PDFSection
                  key={pos}
                  title={`${posDesc?.title || `Позиция ${pos}`} — Аркан ${arcana} (${getArcanaName(arcana)})`}
                  highlight={pos === 12}
                >
                  {posDesc?.description}
                  {"\n\n"}
                  {getArcanaDescription(arcana)}
                </PDFSection>
              );
            })}
          </PDFContentPage>
        </div>

        {/* Страница 6: Код успеха + CTA */}
        <div data-pdf-page="6">
          <PDFContentPage title={t("results.successCode")} pageNumber={6}>
            <PDFSection
              title={`${t("results.successCode")}: ${matrix.successCode.join(" - ")}`}
              highlight
            >
              {t("results.successCodeDesc")}
              {"\n\n"}
              {matrix.successCode.map((arcana, i) => `${arcana} — ${getArcanaName(arcana)}`).join("\n")}
            </PDFSection>
            
            {/* CTA */}
            <div 
              className="mt-10 p-6 rounded-lg text-center"
              style={{ 
                backgroundColor: 'rgba(201, 168, 108, 0.15)',
                border: '2px solid #C9A86C'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ 
                  color: '#5C4033',
                  fontFamily: 'Cormorant, Georgia, serif'
                }}
              >
                {t("pdf.consultationTitle")}
              </h3>
              <p style={{ color: '#8B7355' }} className="mb-3">
                {t("pdf.consultationText")}
              </p>
              <p 
                className="text-lg font-medium"
                style={{ color: '#C9A86C' }}
              >
                Telegram: @galiullin_ruzal
              </p>
            </div>
          </PDFContentPage>
        </div>
      </div>
    );
  }
);

PersonalMatrixPDF.displayName = "PersonalMatrixPDF";
