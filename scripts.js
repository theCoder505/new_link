    var currentTab = 0; // Current tab is set to be the first tab (0)
    showTab(currentTab); // Display the current tab

    function showTab(n) {
        // This function will display the specified tab of the form...
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else {
            document.getElementById("nextBtn").innerHTML = "Next &gt";
        }
        //... and run a function that will display the correct step indicator:
        fixStepIndicator(n)
    }


    function nextPrev(n) {
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        var formData = validateForm();
        if (n == 1 && !formData) return false;

        if (n == 1) {
            formData.append('step', currentTab);

            $.ajax({
                url: 'form1save.php',
                data: formData,
                type: 'POST',
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                success: function() {

                    beforeShowTab(n, x);

                },
                error: function() {
                    alert('Error: could not save the form, please try again.');
                }
            });
        } else {
            beforeShowTab(n, x);
        }

    }

    function beforeShowTab(n, x) {
        // mark the step as finished and valid:
        document.getElementsByClassName("step")[currentTab].className += " finish";
        // Hide the current tab:
        x[currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        currentTab = currentTab + n;
        //   // if you have reached the end of the form...
        if (currentTab >= x.length) {
            alert('Form successfully submitted');
            window.location.href = "/cbs-forms/";
            return false;
        }
        // Otherwise, display the correct tab:
        showTab(currentTab);
    }

    function validateForm() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        var formData = new FormData();
        for (i = 0; i < y.length; i++) {

            if (y[i].type != "file") {
                if (y[i].value == "") {
                    y[i].className += " invalid";
                    valid = false;
                }
                if (y[i].type == "radio") {
                    if (!formData.has(y[i].name)) {
                        formData.append(y[i].name, $(x[currentTab]).find("input[name=" + y[i].name + "]:checked").val());
                    }
                } else {
                    formData.append(y[i].name, y[i].value);
                }
            } else {
                if (!y[i].classList.contains('hideFile')) {
                    if (y[i].value == "") {
                        y[i].className += " invalid";
                        valid = false;
                    } else {
                        formData.append(y[i].name, y[i].files[0], y[i].files[0].name);
                    }
                }
            }
        }

        return valid ? formData : null; // return the data if valid
    }

    function fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class on the current step:
        x[n].className += " active";
    }

    function changeImg(name) {
        var inp = $('input[name="' + name + '"]');
        inp.eq(0).removeClass('hideFile');

    }

    function setData(data) {
        for (let key of Object.keys(data)) {
            var inp = $('input[name="' + key + '"]');
            if (inp.length > 0) {
                var inpType = inp.eq(0).attr('type');
                switch (inpType) {
                    case "radio":
                        $("input[name='" + key + "'][value=" + data[key] + "]").prop('checked', true);
                        break;
                    case "file":
                        inp.eq(0).addClass('hideFile');
                        inp.eq(0).next().children('img').eq(0).prop('src', '../uploads/form1/' + data[key]);
                        break;
                    default:
                        inp.val(data[key]);
                        break;
                }

            }
        }
    }