import { ProductData } from './types.js';

export const productData: ProductData = {
  "facets": [
    {
      "id": "categoria",
      "title": "O que você procura?",
      "type": "choice",
      "attribute": "categoria",
      "displayType": "card_text_image",
      "options": {
        "labelMap": { "janela": "Janela", "porta": "Porta" },
        "imageMap": {
          "janela": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_manual.webp",
          "porta": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_vidro.webp"
        },
        "sort": ["janela", "porta"]
      }
    },
    {
      "id": "sistema",
      "title": "Qual sistema de abertura você prefere?",
      "type": "choice",
      "attribute": "sistema",
      "displayType": "card_text_image",
      "options": {
        "labelMap": { "janela-correr": "Correr", "porta-correr": "Correr", "porta-giro": "Giro", "maxim-ar": "Maxim-Ar" },
        "imageMap": {
          "janela-correr": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_manual.webp",
          "porta-correr": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_2folhas_manual.webp",
          "porta-giro": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_vidro.webp",
          "maxim-ar": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_maximar_1modulo.webp"
        }
      }
    },
    {
      "id": "persiana",
      "title": "Precisa de persiana integrada?",
      "type": "choice",
      "attribute": "persiana",
      "displayType": "card_text_image",
      "options": {
        "labelMap": { "sim": "Sim", "nao": "Não" },
        "breadcrumbLabelMap": { "sim": "Com Persiana", "nao": "Sem Persiana" },
        "imageMap": {
            "sim": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_persiana_manual.webp",
            "nao": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_manual.webp"
        }
      },
      "breadcrumb": { "hideValues": ["nao"] }
    },
    {
      "id": "persianaMotorizada",
      "title": "Persiana motorizada ou manual?",
      "type": "choice",
      "attribute": "persianaMotorizada",
      "displayType": "card_text_image",
      "options": {
        "labelMap": { "motorizada": "Motorizada", "manual": "Manual" },
        "imageMap": {
            "motorizada": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_persiana-integrada_motorizada.webp",
            "manual": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_persiana_manual.webp"
        }
      },
      "breadcrumb": { "hideValues": ["manual"] }
    },
    {
      "id": "material",
      "title": "Qual material de preenchimento você deseja?",
      "type": "choice",
      "attribute": "material",
      "displayType": "card_text_image",
      "options": {
          "labelMap": {
              "vidro": "Vidro",
              "vidro + veneziana": "Vidro e Veneziana",
              "lambri": "Lambri",
              "veneziana": "Veneziana",
              "vidro + lambri": "Vidro e Lambri"
          },
          "imageMap": {
              "vidro": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_manual.webp",
              "vidro + veneziana": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_veneziana.webp",
              "lambri": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_lambris.webp",
              "veneziana": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_veneziana.webp",
              "vidro + lambri": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_metade_lambris.webp"
          }
      }
    },
    {
      "id": "largura",
      "title": "Qual a largura do vão?",
      "type": "choice",
      "attribute": "largura",
      "displayType": "chip_text",
      "options": {
        "labelFromValue": "{{$}}m"
      }
    },
    {
      "id": "folhasNumber",
      "title": "Para este tamanho, qual o número de folhas?",
      "type": "choice",
      "attribute": "folhasNumber",
      "displayType": "card_text_image",
      "options": {
        "labelFromValue": "{{$}} Folha(s)",
        "sortNumeric": true,
        "imageMap": {
            "1": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_maximar_1modulo.webp",
            "2": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_manual.webp",
            "3": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_3folhas_manual.webp",
            "4": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_4folhas_manual.webp",
            "6": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_6folhas_veneziana.webp"
        }
      }
    }
  ],
  "productCatalog": [
    { "sku": "J-COR-VIDRO-PERS-MOT-001", "url": "https://drive.google.com/file/d/1d-jtsLV5QkLMRC3kn7t9A6fXd5LlCpj4/preview", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_persiana-integrada_motorizada.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "sim", "persianaMotorizada": "motorizada", "material": "vidro", "minLargura": 0.7, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "J-COR-VIDRO-PERS-MAN-002", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-de-correr-2-folhas-com-persiana-integrada-manual-18.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_persiana_manual.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "sim", "persianaMotorizada": "manual", "material": "vidro", "minLargura": 0.7, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "J-COR-VIDRO-003", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-de-correr-2-folhas-com-vidro-temperado-6mm-6.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_manual.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 0.7, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "J-COR-VIDRO-004", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-de-correr-3-folhas-com-vidro-temperado-6mm-37.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_3folhas_manual.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 1, "maxLargura": 3, "folhasNumber": 3 },
    { "sku": "J-COR-VIDRO-005", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-de-correr-4-folhas-com-vidro-temperado-6mm-14.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_4folhas_manual.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 1.2, "maxLargura": 4, "folhasNumber": 4 },
    { "sku": "J-COR-VIDRO-VEN-006", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-veneziana-3-folhas-com-vidro-temperado-6mm--17.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_2folhas_veneziana.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + veneziana", "minLargura": 0.7, "maxLargura": 2, "folhasNumber": 3 },
    { "sku": "J-COR-VIDRO-VEN-007", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-de-correr-6-folhas-veneziana-veneziana-vidro.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_de_correr_6folhas_veneziana.webp", "categoria": "janela", "sistema": "janela-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + veneziana", "minLargura": 1.4, "maxLargura": 3, "folhasNumber": 6 },
    { "sku": "J-MAX-VIDRO-008", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-maxim-ar-com-1-modulo-com-vidro-13.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_maximar_1modulo.webp", "categoria": "janela", "sistema": "maxim-ar", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 0.4, "maxLargura": 1, "folhasNumber": 1 },
    { "sku": "J-MAX-VIDRO-009", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-maxim-ar-2-modulos-com-vidro-9.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_maximar_2modulos.webp", "categoria": "janela", "sistema": "maxim-ar", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 0.8, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "J-MAX-VIDRO-010", "url": "https://fabricadoaluminio.com.br/produto/janelasa/janela-maxim-ar-com-3-modulos-simetricos-com-vidro-46.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/janela_maximar_3modulos.webp", "categoria": "janela", "sistema": "maxim-ar", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 1.2, "maxLargura": 3, "folhasNumber": 3 },
    { "sku": "P-COR-VIDRO-PERS-MOT-011", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-correr-2-folhas-com-persiana-integrada-motorizada-32.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_2folhas_persiana_integrada_motorizada.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "sim", "persianaMotorizada": "motorizada", "material": "vidro", "minLargura": 0.8, "maxLargura": 2.5, "folhasNumber": 2 },
    { "sku": "P-COR-VIDRO-PERS-MAN-012", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-correr-2-folhas-com-persiana-integrada-manual-29.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_2folhas_persiana_integrada_manual.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "sim", "persianaMotorizada": "manual", "material": "vidro", "minLargura": 0.8, "maxLargura": 2.5, "folhasNumber": 2 },
    { "sku": "P-COR-VIDRO-013", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-correr-2-folhas-com-vidro-temperado-6mm--27.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_2folhas_manual.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 0.7, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "P-COR-VIDRO-014", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-correr-3-folhas-sequenciais-com-vidro-temperado-6mm--33.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_3folhas_manual.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 1.3, "maxLargura": 3, "folhasNumber": 3 },
    { "sku": "P-COR-VIDRO-015", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-correr-4-folhas-com-vidro-temperado-6mm-38.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_4folhas_manual.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 1.5, "maxLargura": 3, "folhasNumber": 4 },
    { "sku": "P-COR-VIDRO-VEN-016", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-veneziana-de-correr-3-folhas-2-venezianas-e-1-com-vidro-temperado-6mm--31.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_2folhas_veneziana.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + veneziana", "minLargura": 1, "maxLargura": 2.5, "folhasNumber": 3 },
    { "sku": "P-COR-VIDRO-VEN-017", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-6-folhas-sendo-2-venezianas-cegas-2-venezianas-perfuradas-e-2-com-vidro-temperado-6mm--45.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_correr_6folhas_veneziana.webp", "categoria": "porta", "sistema": "porta-correr", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + veneziana", "minLargura": 1.4, "maxLargura": 3, "folhasNumber": 6 },
    { "sku": "P-GIR-LAM-018", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-1-folha-com-lambris-horizontais-34.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_lambris.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "lambri", "minLargura": 0.5, "maxLargura": 1, "folhasNumber": 1 },
    { "sku": "P-GIR-LAM-019", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-2-folhas-em-lambris-horizontais-40.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_2folhas_lambris.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "lambri", "minLargura": 0.8, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "P-GIR-VEN-020", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-1-folha-veneziana-8.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_veneziana.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "veneziana", "minLargura": 0.5, "maxLargura": 1, "folhasNumber": 1 },
    { "sku": "P-GIR-VEN-021", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-2-folhas-veneziana-20.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_2folhas_veneziana.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "veneziana", "minLargura": 0.8, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "P-GIR-VIDRO-022", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-1-folha-com-vidro-temperado-6mm-10.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_vidro.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 0.5, "maxLargura": 1, "folhasNumber": 1 },
    { "sku": "P-GIR-VIDRO-023", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-2-folhas-com-vidro-temperado-6mm-23.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_2folhas_vidro.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "vidro", "minLargura": 0.8, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "P-GIR-MVL-024", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-metade-lambris-horizontais-e-metade-com-vidro-temperado-6mm-1-folha-36.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_metade_lambris.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + lambri", "minLargura": 0.5, "maxLargura": 1, "folhasNumber": 1 },
    { "sku": "P-GIR-MVL-025", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-2-folhas-metade-em-lambris-horizontais-e-metade-com-vidro-temperado-6mm--39.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_2folhas_metade_lambris.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + lambri", "minLargura": 0.8, "maxLargura": 2, "folhasNumber": 2 },
    { "sku": "P-GIR-MVV-026", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-metade-veneziana-e-metade-vidro-temperado-6mm--11.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_1folha_metade_veneziana.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + veneziana", "minLargura": 0.5, "maxLargura": 1, "folhasNumber": 1 },
    { "sku": "P-GIR-MVV-027", "url": "https://fabricadoaluminio.com.br/produto/portas/porta-de-giro-2-folhas-metade-veneziana-e-metade-com-vidro-temperado-6mm-22.php", "image": "https://storage.googleapis.com/ai-studio-bucket-632357271427-us-west1/assets/images/porta_de_giro_2folhas_metade_veneziana.webp", "categoria": "porta", "sistema": "giro", "persiana": "nao", "persianaMotorizada": null, "material": "vidro + veneziana", "minLargura": 0.8, "maxLargura": 2, "folhasNumber": 2 }
  ]
};