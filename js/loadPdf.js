const pdfUrl = './Project_Profolio.pdf';
        const pdfjsLib = window['pdfjs-dist/build/pdf'];

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

        let currentPage = 1;
        let pdfInstance = null;

        const renderPage = (pageNum) => {
            pdfInstance.getPage(pageNum).then(function(page) {
                const scale = 1;
                const viewport = page.getViewport({ scale: scale });

                const container = document.getElementById('pdfContainer');
                const containerRect = container.getBoundingClientRect();

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                const pdfRatio = viewport.width / viewport.height;
                const containerWidth = containerRect.width;
                const containerHeight = containerWidth / pdfRatio;

                canvas.width = containerWidth;
                canvas.height = containerHeight;

                container.innerHTML = '';
                container.appendChild(canvas);

                const scaledViewport = page.getViewport({ scale: containerWidth / viewport.width });

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext);

                const pageInfo = document.getElementById('pageInfo');
                pageInfo.textContent = `Page ${pageNum} of ${pdfInstance.numPages}`;
            });
        };

        const loadPdf = () => {
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            loadingTask.promise.then(function(pdf) {
            pdfInstance = pdf;
            renderPage(currentPage);
            });
        };

        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            if (currentPage < pdfInstance.numPages) {
            currentPage++;
            renderPage(currentPage);
            }
        });

loadPdf();