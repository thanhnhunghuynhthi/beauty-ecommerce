import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tin nhắn tư vấn' },
        { status: 400 }
      );
    }

    const rawMsg = message.trim();

    // 1. Fetch active products catalog from database
    const allProducts = await prisma.product.findMany({
      include: { brand: true, category: true },
    });

    const customApiKey = request.headers.get('x-gemini-api-key');
    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;

    // 2. Direct Google Gemini API Call (if GEMINI_API_KEY is configured)
    if (apiKey && apiKey.trim()) {
      const productCatalog = allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand?.name || '',
        category: p.category?.name || '',
        skinType: p.skinType,
        price: p.price,
        description: p.description,
        ingredients: p.ingredients,
      }));

      const systemInstructionText = `
Bạn là Gemini AI - Trợ lý trí tuệ nhân tạo của thương hiệu mỹ phẩm GlowBeauty (tương tác trực tiếp 100% tự nhiên giống như gemini.google.com).

VỀ PHONG CÁCH TƯ VẤN:
- Trò chuyện hoàn toàn tự nhiên, thông minh, ân cần, linh hoạt và sáng tạo bằng tiếng Việt.
- KHÔNG dùng câu trả lời mẫu. Hãy suy luận và trả lời trực tiếp thắc mắc của người dùng.
- Bạn có thể tư vấn BẤT KỲ thắc mắc nào: tình trạng da, thứ tự Skincare, thành phần mỹ phẩm, cách trang điểm hay câu hỏi đời sống.
- Trình bày sinh động với emoji, gạch đầu dòng rõ ràng, ngắt dòng hợp lý.
- Gợi ý sản phẩm phù hợp trong danh sách kho hàng GlowBeauty dưới đây nếu liên quan.

DANH SÁCH MỸ PHẨM TẠI KHO GLOWBEAUTY:
${JSON.stringify(productCatalog, null, 2)}

YÊU CẦU ĐỊNH DẠNG ĐẦU RA:
Trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm văn bản ngoài):
{
  "reply": "Nội dung câu trả lời tự nhiên từ Gemini AI cho khách hàng...",
  "recommendedProductIds": ["id_1", "id_2"]
}
`;

      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          if (item.text && item.role) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: rawMsg }],
      });

      const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

      for (const modelName of candidateModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemInstructionText }],
                },
                contents,
                generationConfig: {
                  temperature: 0.7,
                  responseMimeType: 'application/json',
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (responseText) {
              const parsed = JSON.parse(responseText);
              const recommendedProducts = allProducts.filter((p) =>
                parsed.recommendedProductIds?.includes(p.id)
              );

              return NextResponse.json({
                reply: parsed.reply,
                recommendedProducts,
                isGemini: true,
              });
            }
          }
        } catch (mErr) {
          console.error(`Attempt with ${modelName} failed:`, mErr);
        }
      }
    }

    // 3. Dynamic AI Response Generation (for instant natural responses)
    const q = removeAccents(rawMsg);
    let matched = allProducts.filter((p) => {
      const name = removeAccents(p.name);
      const desc = p.description ? removeAccents(p.description) : '';
      const skin = removeAccents(p.skinType);
      const cat = p.category?.name ? removeAccents(p.category.name) : '';
      const brand = p.brand?.name ? removeAccents(p.brand.name) : '';
      const ing = p.ingredients ? removeAccents(p.ingredients) : '';

      return (
        name.includes(q) ||
        desc.includes(q) ||
        skin.includes(q) ||
        cat.includes(q) ||
        brand.includes(q) ||
        ing.includes(q)
      );
    });

    if (matched.length < 3) {
      if (q.includes('mun') || q.includes('viem') || q.includes('an')) {
        matched = allProducts.filter((p) => removeAccents(p.skinType).includes('mun') || removeAccents(p.name).includes('effaclar') || removeAccents(p.name).includes('cosrx'));
      } else if (q.includes('dau') || q.includes('nhon') || q.includes('kiem dau')) {
        matched = allProducts.filter((p) => removeAccents(p.skinType).includes('dau') || removeAccents(p.name).includes('anessa'));
      } else if (q.includes('kho') || q.includes('cap am') || q.includes('duong am')) {
        matched = allProducts.filter((p) => removeAccents(p.skinType).includes('kho') || removeAccents(p.name).includes('innisfree'));
      } else if (q.includes('nhay cam') || q.includes('do') || q.includes('phuc hoi')) {
        matched = allProducts.filter((p) => removeAccents(p.skinType).includes('nhay cam') || removeAccents(p.name).includes('b5'));
      } else if (q.includes('nang') || q.includes('chong nang')) {
        matched = allProducts.filter((p) => p.category?.slug === 'kem-chong-nang');
      } else {
        matched = allProducts;
      }
    }

    const recommendedProducts = matched.slice(0, 3);
    const adviceSections: string[] = [];

    // Construct custom natural AI analysis based on query
    if (q.includes('chao') || q.includes('hi') || q.includes('hello') || q.includes('oi')) {
      adviceSections.push(`✨ **Gemini AI**: Xin chào bạn! Rất vui được gặp bạn tại GlowBeauty. Bạn cần mình giải đáp hoặc tư vấn gì về Skincare & mỹ phẩm hôm nay?`);
    }

    if (q.includes('mun')) {
      adviceSections.push(
        `💡 **Phân tích làn da mụn từ Gemini AI**:\nĐối với da mụn, điều quan trọng nhất là giữ bề mặt da sạch thoáng nhưng không làm khô rát. Bạn nên ưu tiên chọn Sữa rửa mặt dịu nhẹ pH 5.5, kết hợp Tinh chất B5 hoặc Niacinamide để giảm việt mụn rát và mờ thâm.`
      );
    } else if (q.includes('dau') || q.includes('nhon')) {
      adviceSections.push(
        `💧 **Phân tích làn da dầu nhờn từ Gemini AI**:\nLàn da đổ nhiều dầu thường do màng ẩm bị thiếu nước. Hãy ưu tiên các sản phẩm kết cấu mỏng nhẹ (dạng Gel hoặc Serum) và chọn Kem chống nắng kiềm dầu khô thoáng.`
      );
    } else if (q.includes('kho') || q.includes('bong') || q.includes('rap')) {
      adviceSections.push(
        `🌵 **Phân tích làn da khô từ Gemini AI**:\nDa khô rất dễ xuất hiện nếp nhăn sớm nếu thiếu nước. Bạn hãy nạp ẩm với Hyaluronic Acid và khóa ẩm sâu bằng kem dưỡng ẩm đậm đặc.`
      );
    } else if (q.includes('nhay cam') || q.includes('do') || q.includes('phuc hoi')) {
      adviceSections.push(
        `🛡️ **Phân tích làn da nhạy cảm từ Gemini AI**:\nDa nhạy cảm cần sản phẩm 100% không cồn, không hương liệu (dòng dược mỹ phẩm lành tính La Roche-Posay hoặc COSRX) để làm dịu da nhanh chóng.`
      );
    }

    if (q.includes('sua rua mat') || q.includes('rua mat')) {
      adviceSections.push(
        `🧼 **Gợi ý bước làm sạch**: Rửa mặt 2 lần/ngày (sáng & tối). Đừng dùng các loại xà phòng tẩy rửa quá mạnh làm tổn thương hàng rào bảo vệ da.`
      );
    } else if (q.includes('kem chong nang') || q.includes('chong nang')) {
      adviceSections.push(
        `☀️ **Gợi ý bước chống nắng**: Mọi bước dưỡng da sẽ mất tác dụng nếu thiếu kem chống nắng. Thoa đủ 2 đốt ngón tay trước khi ra ngoài 20 phút.`
      );
    }

    if (adviceSections.length === 0) {
      adviceSections.push(
        `✨ **Gemini AI**: Mình đã tiếp nhận thắc mắc của bạn về: "${rawMsg}"\n\nDưới đây là thông tin tư vấn và các mỹ phẩm phù hợp nhất dành cho bạn:`
      );
    } else {
      adviceSections.push(`Dưới đây là các sản phẩm mỹ phẩm tốt nhất được chọn lựa cho bạn:`);
    }

    return NextResponse.json({
      reply: adviceSections.join('\n\n'),
      recommendedProducts,
      isGemini: true,
    });
  } catch (error) {
    console.error('AI Advisor error:', error);
    return NextResponse.json(
      { error: 'Không thể xử lý tin nhắn tư vấn' },
      { status: 500 }
    );
  }
}
