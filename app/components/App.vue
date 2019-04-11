<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!" android:flat="true"/>
        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff">
            <TabViewItem title="Tab 1">
                <GridLayout columns="25, *, 10, *, 15, 25" rows="50, 50, 50, 50, 50, 50, 50, 50">
                    <label class=left-align row="0" col="1" text="Bill"></label>
                    <label row="0" col="2">$</label>
                    <NumericKeyboardView 
                        editable=true
                        keyboardType="number"
                        returnKeyType="done"
                        hint="0.00"
                        row="0"
                        col="3"
                        type="number"
                        class=right-align
                        ref="inputBill"
                        v-on:blur="setBill"
                    >
                    </NumericKeyboardView>
                    <label class=left-align row="1" col="1" text="Tax"></label>
                    <NumericKeyboardView
                        editable=true
                        keyboardType="phone"
                        returnKeyType="done"
                        hint="0"
                        row="1"
                        col="3"
                        type="number"
                        class=right-align
                        ref="inputTax"
                        v-on:textChange="setTaxRate"
                    >
                    </NumericKeyboardView>
                    <label row="1" col="4">%</label>

                    <label class=left-align row="2" col="1" text="Tip in %"></label>
                    <NumericKeyboardView
                        editable=true
                        keyboardType="phone"
                        returnKeyType="done"
                        hint="0"
                        row="2"
                        col="3"
                        type="number"
                        class=right-align
                        ref="inputTipRate"
                        v-on:blur="setTipRate"
                        v-bind:text="tipRate"
                    >
                    </NumericKeyboardView>
                    <label row="2" col="4">%</label>

                    <label class=left-align row="3" col="1" text="Tip in $"></label>
                    <label row="3" col="2">$</label>
                    <NumericKeyboardView
                        editable=true
                        keyboardType="phone"
                        returnKeyType="done"
                        hint="0.00"
                        row="3"
                        col="3" 
                        type="number"
                        class=right-align
                        ref="inputTipTotal"
                        v-on:blur="setTip"
                        v-bind:text="tipTotal"
                    >
                    </NumericKeyboardView>

                    <label class=left-align row="4" col="1" text="Total Bill"></label>
                    <label row="4" col="2">$</label>
                    <label class=right-align row=4 col=3 v-if="isNaN(totalBill)">0.00</label>
                    <label class=right-align row=4 col=3 v-if="!isNaN(totalBill)">{{totalBill}}</label>

                    <Button text="Split Bill" row=5 col=1 colSpan=3  v-if="!splitIndicator" @tap="toggleSplit"/>
                    <Button text="Single Bill" row=7 col=1 colSpan=3 v-if="splitIndicator" @tap="toggleSplit"/>

                    <label v-show="splitIndicator" class=left-align row=5 col=1 text="Number of People"></label>
                    <NumericKeyboardView
                        row=5 
                        col=3
                        editable=true
                        class=right-align
                        type="number"
                        keyboardType="phone"
                        returnKeyType="done"
                        v-on:textChange="setNumberOfPeople"
                        ref="inputNumberOfPeople"
                        v-bind:text="numberOfPeople"
                        v-show="splitIndicator"
                    >
                    </NumericKeyboardView> 

                    <label v-show="splitIndicator" class=left-align row=6 col=1 text="Price per Person"></label>
                    <label v-show="splitIndicator" class=right-align row=6 col=2>$</label>
                    <label class=right-align row=6 col=3 v-show="splitIndicator">{{splitBill}}</label>

                </GridLayout>

            </TabViewItem>
            <TabViewItem title="Tab 2">
                <GridLayout columns="25, *, 10, *, 15, 25" rows="50, 50, 50, 50, 50, 50, 50">
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="Tab 3">
                <GridLayout columns="*" rows="*">
                </GridLayout>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script >
  export default {
    data() {
      return {
        bill: '',
        taxRate: '',
        tipRate: '',
        tipTotal: '',
        totalBill: '0.00',
        numberOfPeople: 1,
        splitBill: '0.00',
        splitIndicator: false
      }
    },
    methods: {
        computeTotalBill(){
            if(!isNaN(this.taxRate) && !isNaN(this.tipRate) && !isNaN(this.bill)){
                this.totalBill = 
                    (this.bill + ((this.bill*this.taxRate)/100) 
                    + this.bill*(this.tipRate)/100).toFixed(2);
            }
            else if(!isNaN(this.taxRate) && isNaN(this.tipRate) && !isNaN(this.bill)){
                this.totalBill = 
                    (this.bill + this.bill*this.taxRate/100).toFixed(2);
            }
            else if(isNaN(this.taxRate) && !isNaN(this.tipRate)){
                this.totalBill = 
                    (this.bill + this.bill*this.tipRate/100).toFixed(2);
            }
            else if(isNaN(this.taxRate) && isNaN(this.tipRate)){
                this.totalBill = (this.bill).toFixed(2);
            }
        },

        //Set the values of variables from numpad
        setBill(){
            this.bill = parseFloat(parseFloat(this.$refs.inputBill.nativeView.text).toFixed(2));
            this.computeTotalBill();
        },

        setTaxRate(){
            this.taxRate = parseFloat(this.$refs.inputTax.nativeView.text);
            this.computeTotalBill();
        },

        setTipRate(){
            this.tipRate = parseFloat(this.$refs.inputTipRate.nativeView.text);
            this.computeTipTotal();
        },
        
        setTip(){
            this.tipTotal = parseFloat(this.$refs.inputTipTotal.nativeView.text);
            this.computeTipRate();
        },

        setNumberOfPeople(){
            this.numberOfPeople = parseInt(this.$refs.inputNumberOfPeople.nativeView.text);
            this.computeBillSplit();
        },


        computeTipTotal(){
            if(!isNaN(this.tipRate) && !isNaN(this.bill)){
                this.tipTotal = ((this.bill * this.tipRate)/100).toFixed(2);
                this.computeTotalBill();
            }
        },

        computeTipRate(){
            if(!isNaN(this.tipTotal) && !isNaN(this.bill)){
                this.tipRate = ((this.tipTotal / this.bill) * 100).toFixed(2);
                this.computeTotalBill();
            }

        },

        computeBillSplit(){
            if(!isNaN(this.totalBill) && !isNaN(this.numberOfPeople)){
                this.splitBill = (this.totalBill / this.numberOfPeople).toFixed(2);
            }
            else if(!isNaN(this.totalBill) && (this.numberOfPeople == 0 || isNaN(this.numberOfPeople))){
                this.numberOfPeople = 1;
                this.splitBill = parseFloat((this.totalBill)).toFixed(2);
            }
        },

        toggleSplit(){
            if(this.splitIndicator == true){
                this.splitIndicator = false;
            }
            else if(this.splitIndicator == false){
                this.splitIndicator = true;
            }
        }
    }

  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }

    .left-align {
        text-align: left;
        padding-left: 15%;
    }
    .right-align {
        text-align: right;
        padding-right: 15%;
    }

</style>
