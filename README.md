<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currency Counter & Word Converter</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-100 p-4 md:p-10 font-sans">

    <div class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <section>
                <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 border-b-4 border-emerald-500 pb-2">
                    <i class="fa-solid fa-money-bill-1-wave text-emerald-500"></i> Currency Notes
                </h2>
                <div id="notes-container" class="space-y-3">
                    <template id="row-template">
                        <div class="flex items-center justify-between p-3 rounded-lg border-l-4 transition-all">
                            <span class="font-bold text-lg label-text"></span>
                            <div class="flex items-center gap-4">
                                <input type="number" min="0" placeholder="0" class="w-20 p-2 border rounded text-center focus:ring-2 focus:ring-emerald-300 outline-none count-input">
                                <span class="font-bold text-lg min-w-[80px] text-right row-total">₹0</span>
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <section class="flex flex-col">
                <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 border-b-4 border-gray-700 pb-2">
                    <i class="fa-solid fa-coins text-gray-700"></i> Coins
                </h2>
                <div id="coins-container" class="space-y-3 mb-8"></div>

                <div class="mt-auto bg-gradient-to-br from-emerald-600 to-blue-700 text-white p-8 rounded-2xl text-center shadow-xl">
                    <div class="text-xl flex justify-center items-center gap-2 mb-2 opacity-90">
                        <i class="fa-solid fa-calculator"></i> Total Amount
                    </div>
                    <div id="grand-total" class="text-5xl font-black mb-4 tracking-tight">₹0</div>

                    <div class="pt-4 border-t border-white/20">
                        <span class="text-xs uppercase tracking-[0.2em] opacity-70 font-bold">In Words</span>
                        <div id="total-in-words" class="text-lg font-medium italic mt-2 capitalize leading-snug">Zero Rupees Only</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 mt-6">
                    <button onclick="clearAll()" class="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95">
                        <i class="fa-solid fa-trash-can"></i> Clear All Fields
                    </button>
                </div>
            </section>
        </div>
    </div>

    <script>
        const denominations = {
            notes: [
                { val: 500, color: 'border-blue-500 bg-blue-50 text-blue-700' },
                { val: 200, color: 'border-orange-500 bg-orange-50 text-orange-700' },
                { val: 100, color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                { val: 50,  color: 'border-pink-500 bg-pink-50 text-pink-700' },
                { val: 20,  color: 'border-indigo-500 bg-indigo-50 text-indigo-700' },
                { val: 10,  color: 'border-red-500 bg-red-50 text-red-700' }
            ],
            coins: [
                { val: 5, color: 'border-slate-400 bg-slate-50 text-slate-700' },
                { val: 2, color: 'border-slate-300 bg-slate-50 text-slate-700' },
                { val: 1, color: 'border-slate-200 bg-slate-50 text-slate-700' }
            ]
        };

        function init() {
            renderSection('notes-container', denominations.notes, 'Notes');
            renderSection('coins-container', denominations.coins, 'Coins');
            calculate(); // Initialize total as 0
        }

        function renderSection(containerId, list, suffix) {
            const container = document.getElementById(containerId);
            const template = document.getElementById('row-template');

            list.forEach(item => {
                const clone = template.content.cloneNode(true);
                const wrapper = clone.querySelector('div');
                wrapper.className += ` ${item.color}`;
                clone.querySelector('.label-text').textContent = `₹${item.val} ${suffix}`;

                const input = clone.querySelector('.count-input');
                input.dataset.value = item.val;
                input.addEventListener('input', calculate);
                container.appendChild(clone);
            });
        }

        function calculate() {
            let grandTotal = 0;
            const inputs = document.querySelectorAll('.count-input');

            inputs.forEach(input => {
                const count = parseFloat(input.value) || 0;
                const multiplier = parseInt(input.dataset.value);
                const rowTotal = count * multiplier;
                grandTotal += rowTotal;
                input.nextElementSibling.textContent = `₹${rowTotal.toLocaleString('en-IN')}`;
            });

            document.getElementById('grand-total').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
            document.getElementById('total-in-words').textContent = numberToWords(grandTotal) + " Rupees Only";
        }

        function numberToWords(num) {
            if (num === 0) return "Zero";

            const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
            const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

            const format = (n, suffix) => {
                if (n === 0) return "";
                let str = "";
                if (n > 19) {
                    str += b[Math.floor(n / 10)] + " " + a[n % 10];
                } else {
                    str += a[n];
                }
                return str + suffix;
            };

            let res = "";
            res += format(Math.floor(num / 10000000), "Crore ");
            res += format(Math.floor((num / 100000) % 100), "Lakh ");
            res += format(Math.floor((num / 1000) % 100), "Thousand ");
            res += format(Math.floor((num / 100) % 10), "Hundred ");

            if (num > 100 && num % 100 !== 0) res += "and ";
            res += format(num % 100, "");

            return res.trim();
        }

        function clearAll() {
            document.querySelectorAll('.count-input').forEach(input => input.value = "");
            calculate();
        }

        init();
    </script>
</body>
</html>
