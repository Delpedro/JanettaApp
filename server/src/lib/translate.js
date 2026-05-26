export async function translateToEnglish(namePl, descriptionPl) {
  const [nameRes, descRes] = await Promise.all([
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(namePl)}&langpair=pl|en`),
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(descriptionPl)}&langpair=pl|en`),
  ]);

  if (!nameRes.ok || !descRes.ok) throw new Error('Translation request failed');

  const [nameData, descData] = await Promise.all([nameRes.json(), descRes.json()]);

  const name_en = nameData.responseData?.translatedText;
  const description_en = descData.responseData?.translatedText;

  if (!name_en || !description_en) throw new Error('Empty translation response');

  return { name_en, description_en };
}
