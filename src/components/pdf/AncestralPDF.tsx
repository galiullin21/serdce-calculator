import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { AncestralResult } from "@/lib/ancestral";
import { PDFCoverPage } from "./PDFCoverPage";
import { PDFContentPage } from "./PDFContentPage";
import { PDFSection } from "./PDFSection";

interface AncestralPDFProps {
  result: AncestralResult;
  name: string;
}

export const AncestralPDF = forwardRef<HTMLDivElement, AncestralPDFProps>(
  ({ result, name }, ref) => {
    const { t } = useTranslation();

    const formatBirthDate = () => {
      const { day, month, year } = result.birthDate;
      return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    };

    const getDigitInterpretation = (digit: string, count: number) => {
      const key = `ancestral.interpretations.${digit}.${Math.min(count, 4)}`;
      return t(key);
    };

    const digitInfo = [
      { digit: "2", count: result.starCounts.twos, title: t("ancestral.digits.twoTitle") },
      { digit: "4", count: result.starCounts.fours, title: t("ancestral.digits.fourTitle") },
      { digit: "8", count: result.starCounts.eights, title: t("ancestral.digits.eightTitle") },
      { digit: "5", count: result.starCounts.fives, title: t("ancestral.digits.fiveTitle") },
      { digit: "7", count: result.starCounts.sevens, title: t("ancestral.digits.sevenTitle") },
    ];

    const hasRoles = result.roles.isKeeper || result.roles.isHealer || result.roles.isLastHope;
    
    // Рассчитываем общее количество страниц
    let pageCount = 2; // Обложка + рабочие числа
    if (hasRoles) pageCount++;
    if (result.roles.hasCurse) pageCount++;
    pageCount += digitInfo.length; // По странице на каждую цифру
    pageCount++; // CTA страница

    let currentPage = 2;

    return (
      <div ref={ref} className="absolute left-[-9999px] top-0">
        {/* Страница 1: Обложка */}
        <div data-pdf-page="1">
          <PDFCoverPage
            title={t("pdf.ancestralTitle")}
            subtitle={t("pdf.ancestralSubtitle")}
            birthDate={formatBirthDate()}
            name={name}
            extraInfo={result.gender === 'female' ? t("ancestral.female") : t("ancestral.male")}
          />
        </div>

        {/* Страница 2: Рабочие числа */}
        <div data-pdf-page="2">
          <PDFContentPage title={t("ancestral.workingNumbers")} pageNumber={currentPage++}>
            <div className="mb-6">
              <p className="mb-2" style={{ color: '#8B7355' }}>
                {t("ancestral.dateRow")}:
              </p>
              <p className="text-xl font-mono mb-4" style={{ color: '#5C4033' }}>
                {result.birthDate.day.toString().padStart(2, '0')}.
                {result.birthDate.month.toString().padStart(2, '0')}.
                {result.birthDate.year}
              </p>
              
              <p className="mb-2" style={{ color: '#8B7355' }}>
                {t("ancestral.workingRow")}:
              </p>
              <div className="flex gap-4 mb-4">
                {[
                  result.workingNumbers.first,
                  result.workingNumbers.second,
                  result.workingNumbers.third,
                  result.workingNumbers.fourth,
                ].map((num, i) => (
                  <div 
                    key={i}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ 
                      backgroundColor: 'rgba(201, 168, 108, 0.2)',
                      border: '2px solid #C9A86C',
                      color: '#5C4033'
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              
              <p className="text-sm" style={{ color: '#8B7355' }}>
                {t("ancestral.allDigits")}: {result.allDigits}
              </p>
            </div>

            {/* Кармическая звезда - упрощённое представление */}
            <PDFSection title={t("ancestral.karmicStar")}>
              <div className="flex flex-wrap gap-4 justify-center">
                {digitInfo.map((info) => (
                  <div 
                    key={info.digit}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ 
                      backgroundColor: info.count > 0 ? '#C9A86C' : 'rgba(201, 168, 108, 0.2)',
                      color: info.count > 0 ? '#FAF6F1' : '#8B7355'
                    }}
                  >
                    <span className="font-bold">{info.digit}</span>
                    <span>×{info.count}</span>
                  </div>
                ))}
              </div>
            </PDFSection>
          </PDFContentPage>
        </div>

        {/* Страница: Роли (если есть) */}
        {hasRoles && (
          <div data-pdf-page={currentPage}>
            <PDFContentPage title={t("ancestral.yourRole")} pageNumber={currentPage++}>
              {result.roles.isKeeper && (
                <PDFSection title={t("ancestral.roles.keeper")} highlight>
                  {t("ancestral.roles.keeperDesc")}
                </PDFSection>
              )}
              {result.roles.isHealer && (
                <PDFSection title={t("ancestral.roles.healer")} highlight>
                  {t("ancestral.roles.healerDesc")}
                </PDFSection>
              )}
              {result.roles.isLastHope && (
                <PDFSection title={t("ancestral.roles.lastHope")} highlight>
                  {t("ancestral.roles.lastHopeDesc")}
                </PDFSection>
              )}
            </PDFContentPage>
          </div>
        )}

        {/* Страница: Проклятие (если есть) */}
        {result.roles.hasCurse && (
          <div data-pdf-page={currentPage}>
            <PDFContentPage title={t("ancestral.roles.curse")} pageNumber={currentPage++}>
              <PDFSection title={t("ancestral.roles.curse")}>
                {t("ancestral.roles.curseDesc")}
              </PDFSection>
            </PDFContentPage>
          </div>
        )}

        {/* Страницы: Интерпретации цифр */}
        {digitInfo.map((info) => (
          <div key={info.digit} data-pdf-page={currentPage}>
            <PDFContentPage 
              title={`${t("ancestral.digit")} ${info.digit}: ${info.title}`} 
              pageNumber={currentPage++}
            >
              <div className="mb-4 flex items-center gap-3">
                <div 
                  className="px-4 py-2 rounded-full font-bold"
                  style={{ 
                    backgroundColor: info.count > 0 ? '#C9A86C' : 'rgba(201, 168, 108, 0.2)',
                    color: info.count > 0 ? '#FAF6F1' : '#8B7355'
                  }}
                >
                  ×{info.count}
                </div>
              </div>
              <div 
                className="whitespace-pre-line leading-relaxed"
                style={{ color: '#5C4033' }}
              >
                {getDigitInterpretation(info.digit, info.count)}
              </div>
            </PDFContentPage>
          </div>
        ))}

        {/* Последняя страница: CTA */}
        <div data-pdf-page={currentPage}>
          <PDFContentPage title={t("pdf.consultationTitle")} pageNumber={currentPage}>
            <div 
              className="p-8 rounded-lg text-center"
              style={{ 
                backgroundColor: 'rgba(201, 168, 108, 0.15)',
                border: '2px solid #C9A86C'
              }}
            >
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ 
                  color: '#5C4033',
                  fontFamily: 'Cormorant, Georgia, serif'
                }}
              >
                {t("ancestral.wantDeepAnalysis")}
              </h3>
              <p style={{ color: '#8B7355' }} className="mb-4 text-lg">
                {t("ancestral.deepAnalysisDesc")}
              </p>
              <p 
                className="text-2xl font-medium"
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

AncestralPDF.displayName = "AncestralPDF";
